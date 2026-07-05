import { randomUUID } from "node:crypto";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import path from "node:path";
import readline from "node:readline";

import { env } from "@/lib/env";
import type { LLMChatFinishReason, LLMChatResult } from "@/lib/types";

type BridgeReadyMessage = {
  type: "ready";
  modelPath: string;
};

type BridgeFatalMessage = {
  type: "fatal";
  error: string;
  traceback?: string;
};

type BridgeTokenMessage = {
  id?: string;
  type: "token";
  delta?: string;
  promptTokens?: number;
  generationTokens?: number;
  totalTokens?: number;
};

type BridgeDoneMessage = {
  id?: string;
  ok: true;
  type: "done";
  content?: string;
  promptTokens?: number;
  generationTokens?: number;
  totalTokens?: number;
  finishReason?: string;
};

type BridgeErrorMessage = {
  id?: string;
  ok: false;
  error?: string;
  traceback?: string;
};

type PendingBridgeRequest = {
  content: string;
  tokenCount: number;
  startedAt: number;
  finishReason: LLMChatFinishReason;
  timeout: NodeJS.Timeout;
  onToken?: (delta: string) => void;
  resolve: (value: LLMChatResult) => void;
  reject: (reason?: unknown) => void;
};

let bridgeProcess: ChildProcessWithoutNullStreams | null = null;
let bridgeReadyPromise: Promise<void> | null = null;
let bridgeQueue = Promise.resolve();
const pendingRequests = new Map<string, PendingBridgeRequest>();

function getBridgeScriptPath() {
  return env.llmBridgeScript.trim() || path.join(process.cwd(), "scripts", "qwen_bridge.py");
}

function normalizeFinishReason(reason?: string | null): LLMChatFinishReason {
  switch (reason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content_filter";
    case "timeout":
      return "timeout";
    default:
      return "unknown";
  }
}

function resolvePending(id: string, result: LLMChatResult) {
  const pending = pendingRequests.get(id);
  if (!pending) {
    return;
  }

  clearTimeout(pending.timeout);
  pendingRequests.delete(id);
  pending.resolve(result);
}

function rejectPending(id: string, error: Error) {
  const pending = pendingRequests.get(id);
  if (!pending) {
    return;
  }

  clearTimeout(pending.timeout);
  pendingRequests.delete(id);
  pending.reject(error);
}

function resetBridge(reason?: string) {
  if (bridgeProcess) {
    bridgeProcess.removeAllListeners();
    bridgeProcess = null;
  }

  bridgeReadyPromise = null;

  for (const [id, pending] of pendingRequests) {
    clearTimeout(pending.timeout);
    pending.reject(new Error(reason ? `qwen-bridge-reset:${reason}` : "qwen-bridge-reset"));
    pendingRequests.delete(id);
  }
}

function ensureBridgeProcess() {
  if (bridgeProcess && bridgeReadyPromise) {
    return bridgeReadyPromise;
  }

  const pythonPath = env.llmBridgePython.trim();
  const scriptPath = getBridgeScriptPath();

  bridgeProcess = spawn(pythonPath, ["-u", scriptPath], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PYTHONUNBUFFERED: "1",
      CYPHER_QWEN_MODEL_PATH: env.llmBridgeModelPath,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  const lineReader = readline.createInterface({
    input: bridgeProcess.stdout,
    crlfDelay: Infinity,
  });

  bridgeReadyPromise = new Promise<void>((resolve, reject) => {
    let readyResolved = false;

    lineReader.on("line", (line) => {
      if (!line.trim()) {
        return;
      }

      let payload:
        | BridgeReadyMessage
        | BridgeFatalMessage
        | BridgeTokenMessage
        | BridgeDoneMessage
        | BridgeErrorMessage;

      try {
        payload = JSON.parse(line) as
          | BridgeReadyMessage
          | BridgeFatalMessage
          | BridgeTokenMessage
          | BridgeDoneMessage
          | BridgeErrorMessage;
      } catch {
        return;
      }

      if ("type" in payload && payload.type === "ready") {
        if (!readyResolved) {
          readyResolved = true;
          resolve();
        }
        return;
      }

      if ("type" in payload && payload.type === "fatal") {
        const error = new Error(`qwen-bridge-fatal:${payload.error}`);
        if (!readyResolved) {
          reject(error);
        }
        resetBridge(payload.error);
        return;
      }

      const requestId = payload.id;
      if (!requestId) {
        return;
      }

      const pending = pendingRequests.get(requestId);
      if (!pending) {
        return;
      }

      if ("type" in payload && payload.type === "token") {
        const delta = payload.delta ?? "";
        if (delta) {
          pending.content += delta;
          pending.tokenCount =
            payload.generationTokens ??
            payload.totalTokens ??
            Math.max(1, Math.ceil(pending.content.length / 3.3));
          pending.onToken?.(delta);
        }
        return;
      }

      if ("ok" in payload && payload.ok === false) {
        rejectPending(
          requestId,
          new Error(payload.error ? `qwen-bridge-error:${payload.error}` : "qwen-bridge-error:unknown"),
        );
        return;
      }

      if ("type" in payload && payload.type === "done") {
        const content = (payload.content ?? pending.content).trim();
        resolvePending(requestId, {
          content,
          finishReason: normalizeFinishReason(payload.finishReason),
          elapsedMs: Date.now() - pending.startedAt,
          tokenCount:
            payload.generationTokens ??
            payload.totalTokens ??
            pending.tokenCount ??
            Math.max(1, Math.ceil(content.length / 3.3)),
          provider: "local-qwen-bridge",
          truncated: normalizeFinishReason(payload.finishReason) === "length",
          source: "llm",
        });
      }
    });

    bridgeProcess?.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      if (!readyResolved && text.trim()) {
        reject(new Error(`qwen-bridge-stderr:${text.trim()}`));
      }
    });

    bridgeProcess?.on("exit", (code, signal) => {
      const reason = `exit:${code ?? "null"}:${signal ?? "null"}`;
      if (!readyResolved) {
        reject(new Error(`qwen-bridge-${reason}`));
      }
      resetBridge(reason);
    });
  });

  return bridgeReadyPromise;
}

function queueBridgeRequest<T>(task: () => Promise<T>) {
  const next = bridgeQueue.then(task, task);
  bridgeQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

async function runBridgeRequest(params: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  onToken?: (delta: string) => void;
}) {
  return queueBridgeRequest(async () => {
    await ensureBridgeProcess();

    if (!bridgeProcess) {
      throw new Error("qwen-bridge-missing-process");
    }

    const id = randomUUID();
    const startedAt = Date.now();
    const effectiveTimeoutMs = Math.max(20_000, params.timeoutMs ?? env.llmTimeoutMs, 90_000);

    const resultPromise = new Promise<LLMChatResult>((resolve, reject) => {
      const timeout = setTimeout(() => {
        pendingRequests.delete(id);
        reject(new Error("qwen-bridge-timeout"));
      }, effectiveTimeoutMs);

      pendingRequests.set(id, {
        content: "",
        tokenCount: 0,
        startedAt,
        finishReason: "unknown",
        timeout,
        onToken: params.onToken,
        resolve,
        reject,
      });
    });

    bridgeProcess.stdin.write(
      `${JSON.stringify({
        id,
        systemPrompt: params.systemPrompt,
        messages: params.messages,
        maxTokens: params.maxTokens ?? 220,
        temperature: params.temperature ?? 0.7,
      })}\n`,
    );

    return resultPromise;
  });
}

export async function chatWithLocalQwenBridge(params: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}) {
  return runBridgeRequest(params);
}

export async function* streamChatWithLocalQwenBridge(params: {
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}): AsyncGenerator<string, LLMChatResult, void> {
  const tokenQueue: string[] = [];
  let wake: (() => void) | null = null;
  let done = false;
  let finalResult: LLMChatResult | null = null;
  let thrown: unknown = null;

  void runBridgeRequest({
    ...params,
    onToken: (delta) => {
      tokenQueue.push(delta);
      wake?.();
      wake = null;
    },
  })
    .then((result) => {
      finalResult = result;
      done = true;
      wake?.();
      wake = null;
    })
    .catch((error) => {
      thrown = error;
      done = true;
      wake?.();
      wake = null;
    });

  while (!done || tokenQueue.length > 0) {
    if (tokenQueue.length > 0) {
      yield tokenQueue.shift()!;
      continue;
    }

    await new Promise<void>((resolve) => {
      wake = resolve;
    });
  }

  if (thrown) {
    throw thrown;
  }

  return (
    finalResult ?? {
      content: "",
      finishReason: "error",
      elapsedMs: 0,
      tokenCount: 0,
      provider: "local-qwen-bridge",
      truncated: false,
      source: "llm",
    }
  );
}
