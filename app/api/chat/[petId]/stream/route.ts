import { randomUUID } from "node:crypto";
import { z } from "zod";

import { assertSafePetChatMessage, normalizePetChatMessage } from "@/lib/ai/content-safety";
import { getViewerContext } from "@/lib/auth";
import { canViewPet } from "@/lib/domain/pets";
import { getPetById, sendChatToPet } from "@/lib/repository";
import type { ChatStreamEvent } from "@/lib/types";

const encoder = new TextEncoder();

const paramsSchema = z.object({
  petId: z.string(),
});

const bodySchema = z.object({
  message: z.string().trim().min(1).max(280),
});

function sse(event: ChatStreamEvent) {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ petId: string }> },
) {
  try {
    const { profile } = await getViewerContext();

    if (!profile) {
      return new Response("请先登录。", { status: 401 });
    }

    const { petId } = paramsSchema.parse(await context.params);
    const { message } = bodySchema.parse(await request.json());
    const normalizedMessage = normalizePetChatMessage(message);
    assertSafePetChatMessage(normalizedMessage);

    const pet = await getPetById(petId);
    if (!pet) {
      return new Response("找不到这只宠物。", { status: 404 });
    }

    if (!canViewPet(pet, profile.id, profile.role)) {
      return new Response("你现在不能和这只宠物说话。", { status: 403 });
    }

    const traceId = randomUUID();
    let streamClosed = false;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let finished = false;
        let sawFirstToken = false;
        const startedAt = Date.now();

        const safeEnqueue = (event: ChatStreamEvent) => {
          if (streamClosed) {
            return false;
          }

          try {
            controller.enqueue(sse(event));
            return true;
          } catch {
            streamClosed = true;
            return false;
          }
        };

        const safeClose = () => {
          if (streamClosed) {
            return;
          }

          streamClosed = true;

          try {
            controller.close();
          } catch {
            // The client may have gone away already.
          }
        };

        safeEnqueue({
          type: "ack",
          petId,
          sessionId: `pending-${traceId}`,
          traceId,
        });

        const generationPromise = sendChatToPet({
          petId,
          userId: profile.id,
          message: normalizedMessage,
          onToken: async (token) => {
            sawFirstToken = true;
            safeEnqueue({
              type: "token",
              token,
              traceId,
            });
          },
          onRepairing: async () => {
            safeEnqueue({
              type: "repairing",
              message: "正在续写完整回复",
              traceId,
            });
          },
          onFallback: async () => {
            safeEnqueue({
              type: "fallback",
              message: "本地模型太慢，切到保险回复",
              traceId,
            });
          },
        });

        void generationPromise.finally(() => {
          finished = true;
        });

        while (!finished && !streamClosed) {
          const stillRunning = await Promise.race([
            generationPromise.then(
              () => false,
              () => false,
            ),
            new Promise<true>((resolve) => setTimeout(() => resolve(true), 1800)),
          ]);

          if (!stillRunning || finished || streamClosed) {
            break;
          }

          const elapsedMs = Date.now() - startedAt;
          safeEnqueue({
            type: "status",
            message: sawFirstToken
              ? "正在把话说完整"
              : elapsedMs >= 12000
                ? "Qwen 还在慢慢想，没有掉回模板"
                : "生成中",
            traceId,
          });
        }

        try {
          const result = await generationPromise;

          if (!streamClosed && !sawFirstToken && result.reply) {
            for (const token of result.reply.split(/(\s+)/).filter(Boolean)) {
              if (
                !safeEnqueue({
                  type: "token",
                  token,
                  traceId,
                })
              ) {
                break;
              }
              await new Promise((resolve) => setTimeout(resolve, 14));
            }
          }

          safeEnqueue({
            type: "done",
            traceId,
            result: {
              content: result.reply,
              finishReason: result.trace?.finishReason ?? "stop",
              elapsedMs: result.trace?.elapsedMs ?? 0,
              tokenCount: result.trace?.tokenCount ?? Math.max(1, Math.ceil(result.reply.length / 3)),
              provider: result.trace?.provider ?? "unknown",
              truncated: result.trace?.truncated ?? false,
              source: result.trace?.source ?? "llm",
            },
            session: result.session,
            reply: result.reply,
            mood: result.mood,
            suggestedAction: result.suggestedAction,
            stateChanges: result.stateChanges,
          });
        } catch (error) {
          safeEnqueue({
            type: "error",
            traceId,
            message: error instanceof Error ? error.message : "对话失败。",
          });
        } finally {
          safeClose();
        }
      },
      cancel() {
        streamClosed = true;
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 500;
    return new Response(error instanceof Error ? error.message : "对话失败。", { status });
  }
}
