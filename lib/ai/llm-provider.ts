import { env } from "@/lib/env";
import type { LLMChatFinishReason, LLMChatResult } from "@/lib/types";

export interface LLMChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LLMProvider {
  chat(params: {
    systemPrompt: string;
    messages: LLMChatMessage[];
    maxTokens?: number;
    temperature?: number;
    model?: string;
    timeoutMs?: number;
  }): Promise<LLMChatResult>;
  streamChat?(params: {
    systemPrompt: string;
    messages: LLMChatMessage[];
    maxTokens?: number;
    temperature?: number;
    model?: string;
    timeoutMs?: number;
  }): AsyncGenerator<string, LLMChatResult, void>;
}

type OpenAICompatibleResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
    finish_reason?: string | null;
  }>;
  usage?: {
    completion_tokens?: number;
    total_tokens?: number;
  };
};

type OpenAICompatibleStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
    finish_reason?: string | null;
  }>;
  usage?: {
    completion_tokens?: number;
    total_tokens?: number;
  };
};

type OpenAICompatibleChatRequestBody = {
  model?: string;
  messages: Array<{
    role: "system" | LLMChatMessage["role"];
    content: string;
  }>;
  temperature?: number;
  max_tokens: number;
  stream: boolean;
  thinking?: {
    type: "disabled";
  };
};

type MLXResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    completion_tokens?: number;
  };
  status?: string;
  finish_reason?: string | null;
};

type MLXStreamEventPayload = {
  type?: string;
  delta?: string;
  text?: string;
  response?: MLXResponse;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    completion_tokens?: number;
  };
};

function coerceContent(
  value:
    | OpenAICompatibleResponse["choices"]
    | OpenAICompatibleStreamChunk["choices"],
  field: "message" | "delta",
) {
  const first = value?.[0] as
    | {
        message?: {
          content?: string | Array<{ type?: string; text?: string }>;
        };
        delta?: {
          content?: string | Array<{ type?: string; text?: string }>;
        };
      }
    | undefined;
  const holder = field === "message" ? first?.message : first?.delta;
  const content = holder?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();
  }

  return "";
}

function normalizeFinishReason(reason?: string | null): LLMChatFinishReason {
  switch (reason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content_filter";
    default:
      return "unknown";
  }
}

function coerceMLXContent(payload: MLXResponse | null) {
  if (!payload) {
    return "";
  }

  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const nested = payload.output
    ?.flatMap((item) => item.content ?? [])
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("")
    .trim();

  return nested ?? "";
}

function coerceTokenCount(
  payload: OpenAICompatibleResponse | OpenAICompatibleStreamChunk | MLXResponse | MLXStreamEventPayload | null,
  fallbackContent: string,
) {
  const responseUsage =
    payload && "response" in payload && payload.response?.usage
      ? payload.response.usage
      : undefined;
  const usage = (responseUsage ?? payload?.usage) as
    | {
        completion_tokens?: number;
        output_tokens?: number;
        total_tokens?: number;
      }
    | undefined;

  return (
    usage?.completion_tokens ??
    usage?.output_tokens ??
    usage?.total_tokens ??
    estimateTokenCount(fallbackContent)
  );
}

function coerceFinishReasonFromPayload(payload: OpenAICompatibleResponse | MLXResponse | null) {
  if (!payload) {
    return "unknown" as const;
  }

  if ("choices" in payload) {
    return normalizeFinishReason(payload.choices?.[0]?.finish_reason);
  }

  if ("finish_reason" in payload && payload.finish_reason) {
    return normalizeFinishReason(payload.finish_reason);
  }

  if ("status" in payload && payload.status === "completed") {
    return "stop" as const;
  }

  return "unknown" as const;
}

function estimateTokenCount(content: string) {
  return Math.max(1, Math.ceil(content.length / 3.3));
}

function isTimeoutLikeError(error: unknown) {
  return (
    error === "timeout" ||
    (error instanceof Error && (error.name === "AbortError" || error.message.includes("timeout")))
  );
}

function getChatCompletionsUrl() {
  return `${env.llmBaseUrl}/chat/completions`;
}

function buildLLMHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const apiKey = env.llmApiKey.trim();
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
}

function isKimiK25Model(model: string | undefined) {
  return model?.trim().toLowerCase() === "kimi-k2.5";
}

/**
 * Local single-model servers reject stale model ids after an upgrade
 * (e.g. Qwen3.5 -> Qwen3.6). When they do, retrying without a model id
 * makes them fall back to whatever model is actually loaded.
 */
export function isModelNotFoundResponse(status: number, bodyText: string) {
  if (status !== 404 && status !== 400) {
    return false;
  }

  return /not_found_error|model\s+'.*'\s+not\s+found|model_not_found/i.test(bodyText);
}

/** Removes reasoning traces that thinking-mode models prepend to replies. */
export function stripThinkBlocks(content: string) {
  const withoutClosed = content.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // An unterminated block means the visible answer never started.
  const openIndex = withoutClosed.toLowerCase().indexOf("<think>");
  const cleaned = openIndex >= 0 ? withoutClosed.slice(0, openIndex) : withoutClosed;

  return cleaned.trim();
}

export function buildOpenAICompatibleChatRequestBody(params: {
  systemPrompt: string;
  messages: LLMChatMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
  stream: boolean;
}): OpenAICompatibleChatRequestBody {
  const model = params.model?.trim();
  const body: OpenAICompatibleChatRequestBody = {
    ...(model ? { model } : {}),
    messages: [
      {
        role: "system",
        content: params.systemPrompt,
      },
      ...params.messages,
    ],
    max_tokens: params.maxTokens ?? 220,
    stream: params.stream,
  };

  if (isKimiK25Model(model)) {
    body.thinking = { type: "disabled" };
  } else {
    body.temperature = params.temperature ?? 0.7;
  }

  return body;
}

export function extractJsonBlock<T>(raw: string): T | null {
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
    if (fenced) {
      try {
        return JSON.parse(fenced) as T;
      } catch {
        return null;
      }
    }

    const bracketStart = Math.min(
      ...["{", "["]
        .map((token) => trimmed.indexOf(token))
        .filter((index) => index >= 0),
    );

    if (Number.isFinite(bracketStart)) {
      const candidate = trimmed.slice(bracketStart);
      const bracketEnd = Math.max(candidate.lastIndexOf("}"), candidate.lastIndexOf("]"));
      if (bracketEnd >= 0) {
        try {
          return JSON.parse(candidate.slice(0, bracketEnd + 1)) as T;
        } catch {
          return null;
        }
      }
    }

    return null;
  }
}

class MockLLMProvider implements LLMProvider {
  async chat(params: {
    systemPrompt: string;
    messages: LLMChatMessage[];
    maxTokens?: number;
    temperature?: number;
    model?: string;
    timeoutMs?: number;
  }) {
    const startedAt = Date.now();
    const lastMessage = params.messages[params.messages.length - 1]?.content ?? "";
    const speakerHint = params.systemPrompt.includes("狗") ? "汪，我听见了。" : "喵，我知道了。";
    const content = `${speakerHint}${lastMessage ? ` 你刚刚说的是：${lastMessage.slice(0, 24)}` : ""}`.trim();
    return {
      content,
      finishReason: "stop" as const,
      elapsedMs: Date.now() - startedAt,
      tokenCount: estimateTokenCount(content),
      provider: "mock",
      truncated: false,
      source: "llm" as const,
    };
  }

  async *streamChat(params: {
    systemPrompt: string;
    messages: LLMChatMessage[];
    maxTokens?: number;
    temperature?: number;
    model?: string;
    timeoutMs?: number;
  }) {
    const result = await this.chat(params);
    const tokens = result.content.split(/(\s+)/).filter(Boolean);
    for (const token of tokens) {
      yield token;
    }
    return result;
  }
}

class LocalQwenLLMProvider implements LLMProvider {
  async chat(params: {
    systemPrompt: string;
    messages: LLMChatMessage[];
    maxTokens?: number;
    temperature?: number;
    model?: string;
    timeoutMs?: number;
  }): Promise<LLMChatResult> {
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeoutMs = Math.max(400, params.timeoutMs ?? env.llmTimeoutMs);
    const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs);

    try {
      let response = await fetch(getChatCompletionsUrl(), {
        method: "POST",
        headers: buildLLMHeaders(),
        body: JSON.stringify(buildOpenAICompatibleChatRequestBody({ ...params, stream: false })),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorText = await response.text();

        if (params.model && isModelNotFoundResponse(response.status, errorText)) {
          console.warn(
            `[cypher-pet] LLM model "${params.model}" not found on server, retrying with the loaded model.`,
          );
          response = await fetch(getChatCompletionsUrl(), {
            method: "POST",
            headers: buildLLMHeaders(),
            body: JSON.stringify(
              buildOpenAICompatibleChatRequestBody({ ...params, model: undefined, stream: false }),
            ),
            signal: controller.signal,
          });

          // Report the retry's own failure, not the stale first-attempt body.
          if (!response.ok) {
            errorText = await response.text();
          }
        }

        if (!response.ok) {
          throw new Error(`qwen-http-${response.status}:${errorText.slice(0, 300)}`);
        }
      }

      const raw = await response.text();
      const payload =
        extractJsonBlock<OpenAICompatibleResponse | MLXResponse>(raw) ??
        null;
      const content = stripThinkBlocks(
        ("choices" in (payload ?? {})
          ? coerceContent((payload as OpenAICompatibleResponse).choices, "message")
          : "") || coerceMLXContent(payload as MLXResponse | null),
      );

      if (!content) {
        throw new Error("qwen-empty-response");
      }

      return {
        content: content.trim(),
        finishReason: coerceFinishReasonFromPayload(payload as OpenAICompatibleResponse | MLXResponse | null),
        elapsedMs: Date.now() - startedAt,
        tokenCount: coerceTokenCount(payload as OpenAICompatibleResponse | MLXResponse | null, content),
        provider: "local-qwen",
        truncated:
          ("choices" in (payload ?? {}) &&
            (payload as OpenAICompatibleResponse).choices?.[0]?.finish_reason === "length") ||
          (payload as MLXResponse | null)?.finish_reason === "length",
        source: "llm" as const,
      };
    } catch (error) {
      if (isTimeoutLikeError(error)) {
        return {
          content: "",
          finishReason: "timeout" as const,
          elapsedMs: Date.now() - startedAt,
          tokenCount: 0,
          provider: "local-qwen",
          truncated: false,
          timedOut: true,
          abortReason: "timeout",
          source: "llm" as const,
        };
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async *streamChat(params: {
    systemPrompt: string;
    messages: LLMChatMessage[];
    maxTokens?: number;
    temperature?: number;
    model?: string;
    timeoutMs?: number;
  }): AsyncGenerator<string, LLMChatResult, void> {
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeoutMs = Math.max(400, params.timeoutMs ?? env.llmTimeoutMs);
    const timeout = setTimeout(() => controller.abort("timeout"), timeoutMs);

    let tokenCount = 0;
    let finishReason: LLMChatFinishReason = "unknown";
    let content = "";

    try {
      let response = await fetch(getChatCompletionsUrl(), {
        method: "POST",
        headers: buildLLMHeaders(),
        body: JSON.stringify(buildOpenAICompatibleChatRequestBody({ ...params, stream: true })),
        signal: controller.signal,
      });

      if (!response.ok && params.model) {
        const errorText = await response.text();

        if (isModelNotFoundResponse(response.status, errorText)) {
          console.warn(
            `[cypher-pet] LLM model "${params.model}" not found on server, retrying with the loaded model.`,
          );
          response = await fetch(getChatCompletionsUrl(), {
            method: "POST",
            headers: buildLLMHeaders(),
            body: JSON.stringify(
              buildOpenAICompatibleChatRequestBody({ ...params, model: undefined, stream: true }),
            ),
            signal: controller.signal,
          });
        }
      }

      if (!response.ok || !response.body) {
        throw new Error(`qwen-http-${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          for (const rawLine of part.split("\n")) {
            const line = rawLine.trim();
            if (line.startsWith("event:")) {
              continue;
            }
            if (!line.startsWith("data:")) {
              continue;
            }

            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") {
              continue;
            }

            const payload = JSON.parse(data) as OpenAICompatibleStreamChunk | MLXStreamEventPayload;
            const chunk =
              ("choices" in payload ? coerceContent(payload.choices, "delta") : "") ||
              ("delta" in payload && typeof payload.delta === "string" ? payload.delta : "") ||
              ("text" in payload && typeof payload.text === "string" ? payload.text : "");
            if (chunk) {
              content += chunk;
              tokenCount += estimateTokenCount(chunk);
              yield chunk;
            }

            const reason =
              "choices" in payload
                ? payload.choices?.[0]?.finish_reason
                : "response" in payload
                  ? payload.response?.finish_reason
                  : undefined;
            if (reason || ("type" in payload && payload.type === "response.completed")) {
              finishReason = reason ? normalizeFinishReason(reason) : "stop";
            }

            const maybeTokenCount = coerceTokenCount(payload, chunk || content);
            if (maybeTokenCount) {
              tokenCount = maybeTokenCount;
            }
          }
        }
      }

      const cleanedContent = stripThinkBlocks(content);

      if (!cleanedContent) {
        throw new Error("qwen-empty-response");
      }

      return {
        content: cleanedContent,
        finishReason,
        elapsedMs: Date.now() - startedAt,
        tokenCount: tokenCount || estimateTokenCount(cleanedContent),
        provider: "local-qwen",
        truncated: finishReason === "length",
        source: "llm" as const,
      };
    } catch (error) {
      if (isTimeoutLikeError(error)) {
        return {
          content: content.trim(),
          finishReason: "timeout" as const,
          elapsedMs: Date.now() - startedAt,
          tokenCount,
          provider: "local-qwen",
          truncated: false,
          timedOut: true,
          abortReason: "timeout",
          source: "llm" as const,
        };
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}

let providerSingleton: LLMProvider | null = null;

export function getLLMProvider(): LLMProvider {
  if (providerSingleton) {
    return providerSingleton;
  }

  const shouldForceMock =
    process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "test";

  providerSingleton =
    shouldForceMock || env.llmProvider === "mock"
      ? new MockLLMProvider()
      : new LocalQwenLLMProvider();
  return providerSingleton;
}
