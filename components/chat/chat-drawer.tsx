"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChatBubble } from "@/components/chat/chat-bubble";
import { ChatDrawerSkeleton } from "@/components/chat/chat-drawer-skeleton";
import { useBufferedStream } from "@/components/chat/use-buffered-stream";
import { SpeechBubble } from "@/components/garden/speech-bubble";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import { describeUnexpectedApiPayload, readJsonResponse } from "@/lib/api-client";
import { cacheKeys } from "@/lib/client/cache-keys";
import { hydrateCache, useUiResource } from "@/lib/client/ui-cache";
import { markPerformance, measurePerformance } from "@/lib/client/perf";
import type { ChatMessage, ChatStreamEvent, GardenPetSnapshot, OwnerAction } from "@/lib/types";

const quickOptions: Array<{ label: string; text: string; action?: OwnerAction }> = [
  { label: "过来", text: "过来，我在这边。" },
  { label: "夸夸", text: "你好乖，今天超棒。" },
  { label: "喂食", text: "🍖 给你一点好吃的。" },
  { label: "玩具", text: "要不要我给你扔玩具？" },
];

export function ChatDrawer({
  open,
  pet,
  viewerId,
  onClose,
  onRefresh,
}: {
  open: boolean;
  pet: GardenPetSnapshot | null;
  viewerId?: string;
  onClose: () => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamStatus, setStreamStatus] = useState<string | null>(null);
  const [hydratedPetId, setHydratedPetId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const sendStartMarkRef = useRef<string | null>(null);
  const firstTokenMarkRef = useRef<string | null>(null);

  const sessionKey = pet ? cacheKeys.chatSession(pet.pet.id) : "chat:disabled";
  const sessionResource = useUiResource<ChatMessage[]>(sessionKey, {
    enabled: open && Boolean(pet),
    fetcher: async () => {
      if (!pet) {
        return [];
      }

      const payload = await readJsonResponse<{
        session?: {
          messages?: ChatMessage[];
        };
      }>(await fetch(`/api/chat/${pet.pet.id}`, { cache: "no-store" }), "聊天记录加载失败。");

      return payload.session?.messages ?? [];
    },
    keepPreviousData: false,
    ttlMs: 15_000,
  });

  const bufferedStream = useBufferedStream((chunk) => {
    const assistantId = assistantMessageIdRef.current;

    if (!assistantId) {
      return;
    }

    setMessages((current) =>
      current.map((message) =>
        message.id === assistantId
          ? {
              ...message,
              content: `${message.content}${chunk}`,
            }
          : message,
      ),
    );
  });

  useEffect(() => {
    if (!pet) {
      setMessages([]);
      setHydratedPetId(null);
      return;
    }

    if (!open) {
      return;
    }

    setMessages(sessionResource.data ?? []);
    setHydratedPetId(pet.pet.id);
  }, [open, pet, sessionResource.data]);

  useEffect(() => {
    if (open) {
      return;
    }

    abortRef.current?.abort();
    abortRef.current = null;
    assistantMessageIdRef.current = null;
    bufferedStream.reset();
    setPending(false);
    setStreamStatus(null);
  }, [bufferedStream, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const startMark = `chat-drawer:open:start:${pet?.pet.id ?? "none"}:${Date.now()}`;
    const endMark = `chat-drawer:open:end:${pet?.pet.id ?? "none"}:${Date.now()}`;
    markPerformance(startMark);

    const frame = window.requestAnimationFrame(() => {
      markPerformance(endMark);
      measurePerformance(`chat-drawer-open:${pet?.pet.id ?? "none"}`, startMark, endMark);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open, pet?.pet.id]);

  const title = useMemo(() => {
    if (!pet) {
      return "和宠物聊天";
    }

    return `和 ${pet.pet.name} 聊聊`;
  }, [pet]);

  async function sendMessage(content: string) {
    if (!pet || pending || !content.trim()) {
      return;
    }

    const trimmedContent = content.trim();
    const userMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      petId: pet.pet.id,
      participantType: "user",
      participantId: viewerId ?? "guest",
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };
    const assistantId = `assistant-${Date.now()}`;
    const controller = new AbortController();
    const sendStartMark = `chat-send:start:${pet.pet.id}:${Date.now()}`;

    abortRef.current?.abort();
    abortRef.current = controller;
    assistantMessageIdRef.current = assistantId;
    sendStartMarkRef.current = sendStartMark;
    firstTokenMarkRef.current = sendStartMark;
    bufferedStream.reset();

    try {
      setPending(true);
      setError(null);
      setStreamStatus("生成中");
      setDraft("");
      setMessages((current) => [
        ...current,
        userMessage,
        {
          id: assistantId,
          petId: pet.pet.id,
          participantType: "pet",
          participantId: pet.pet.id,
          content: "",
          createdAt: new Date().toISOString(),
        },
      ]);
      markPerformance(sendStartMark);

      const response = await fetch(`/api/chat/${pet.pet.id}/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedContent }),
        signal: controller.signal,
      });
      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok) {
        throw new Error(describeUnexpectedApiPayload(await response.text(), "聊天失败。"));
      }

      if (!contentType.includes("text/event-stream")) {
        throw new Error(describeUnexpectedApiPayload(await response.text(), "聊天接口没有返回流式响应。"));
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let donePayload: Extract<ChatStreamEvent, { type: "done" }> | null = null;

      if (!reader) {
        throw new Error("聊天流不可用。");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          for (const rawLine of chunk.split("\n")) {
            const line = rawLine.trim();

            if (!line.startsWith("data:")) {
              continue;
            }

            let payload: ChatStreamEvent;

            try {
              payload = JSON.parse(line.slice(5).trim()) as ChatStreamEvent;
            } catch {
              throw new Error("聊天流返回了无法解析的数据。");
            }

            if (payload.type === "ack") {
              continue;
            }

            if (payload.type === "status" || payload.type === "repairing" || payload.type === "fallback") {
              setStreamStatus(payload.message);
              continue;
            }

            if (payload.type === "token") {
              if (firstTokenMarkRef.current) {
                const endMark = `chat-send:first-token:${pet.pet.id}:${Date.now()}`;
                markPerformance(endMark);
                measurePerformance(`chat-first-token:${pet.pet.id}`, firstTokenMarkRef.current, endMark);
                firstTokenMarkRef.current = null;
              }

              bufferedStream.append(payload.token);
              continue;
            }

            if (payload.type === "done") {
              donePayload = payload;
              continue;
            }

            if (payload.type === "error") {
              throw new Error(payload.message);
            }
          }
        }
      }

      bufferedStream.flushNow();

      if (!donePayload) {
        throw new Error("聊天流提前结束了。");
      }

      hydrateCache(sessionKey, donePayload.session.messages, 15_000);
      setMessages(donePayload.session.messages);
      setHydratedPetId(pet.pet.id);
      setStreamStatus(null);
      await onRefresh();

      if (sendStartMarkRef.current) {
        const endMark = `chat-send:end:${pet.pet.id}:${Date.now()}`;
        markPerformance(endMark);
        measurePerformance(`chat-send-total:${pet.pet.id}`, sendStartMarkRef.current, endMark);
        sendStartMarkRef.current = null;
      }
    } catch (chatError) {
      if (!(chatError instanceof DOMException && chatError.name === "AbortError")) {
        setError(chatError instanceof Error ? chatError.message : "聊天失败。");
      }

      bufferedStream.flushNow();
      setStreamStatus(null);
    } finally {
      setPending(false);
      abortRef.current = null;
      assistantMessageIdRef.current = null;
    }
  }

  if (!pet) {
    return null;
  }

  return (
    <div
      className={`ease-smooth motion-base fixed inset-x-0 bottom-0 z-40 transition-[transform,opacity] ${open ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
    >
      <div className="chat-drawer-panel mx-auto max-w-4xl rounded-t-[32px] border border-white/10 px-5 pb-5 pt-4 shadow-[0_-30px_80px_rgba(0,0,0,0.42)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-black/30">
              <img
                alt={pet.pet.name}
                className="h-12 w-12 object-contain [image-rendering:pixelated]"
                src={pet.generation.worldSpritePath}
              />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/55">Pet Chat</p>
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
              <div className="flex items-center gap-3">
                <SpeechBubble
                  kind={pet.state.currentBubble?.kind ?? "thought"}
                  text={pet.state.currentBubble?.text ?? `${pet.pet.name} 正在看着你。`}
                />
                <span className="text-xs uppercase tracking-[0.22em] text-white/35">
                  {pet.state.mood} · {pet.state.activity}
                </span>
              </div>
            </div>
          </div>
          <Button onClick={onClose} type="button" variant="ghost">
            关闭
          </Button>
        </div>

        <div className="mb-4 max-h-[38vh] space-y-3 overflow-y-auto rounded-[28px] border border-white/8 bg-black/20 p-4">
          {open && sessionResource.isLoading && hydratedPetId !== pet.pet.id && messages.length === 0 ? (
            <ChatDrawerSkeleton />
          ) : messages.length === 0 ? (
            <p className="text-sm leading-7 text-white/55">
              先和 {pet.pet.name} 说句话。它会根据现在的心情、关系和记忆来回你。
            </p>
          ) : (
            messages.map((message) => (
              <ChatBubble key={message.id} message={message} petName={pet.pet.name} />
            ))
          )}
          {pending ? <SpeechBubble className="inline-flex" kind="speech" text={streamStatus ?? "..."} /> : null}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {quickOptions.map((option) => (
            <Button
              key={option.label}
              disabled={pending}
              onClick={() => sendMessage(option.text)}
              type="button"
              variant="ghost"
            >
              {option.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-3">
          <TextInput
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage(draft);
              }
            }}
            placeholder={`对 ${pet.pet.name} 说点什么...`}
            value={draft}
          />
          <Button disabled={pending || !draft.trim()} onClick={() => sendMessage(draft)} type="button">
            发送
          </Button>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        {!error && streamStatus ? <p className="mt-3 text-sm text-cyan-200/80">{streamStatus}</p> : null}
      </div>
    </div>
  );
}
