import { z } from "zod";

import { getViewerContext } from "@/lib/auth";
import { listNarrativeEvents } from "@/lib/repository";

const querySchema = z.object({
  zoneId: z.enum(["orchard", "pond", "grove", "dog-run"]).default("orchard"),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { zoneId } = querySchema.parse({
    zoneId: url.searchParams.get("zoneId") ?? "orchard",
  });

  const { profile } = await getViewerContext();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let closed = false;
      let interval: ReturnType<typeof setInterval> | null = null;

      const closeStream = () => {
        if (closed) {
          return;
        }

        closed = true;
        if (interval) {
          clearInterval(interval);
          interval = null;
        }

        try {
          controller.close();
        } catch {
          // ignore repeated closes
        }
      };

      const push = async () => {
        if (closed) {
          return;
        }

        const events = await listNarrativeEvents(zoneId, 14, profile?.id);
        if (closed) {
          return;
        }

        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ events, zoneId })}\n\n`));
        } catch {
          closeStream();
        }
      };

      await push();
      interval = setInterval(() => {
        void push();
      }, 3000);

      const abort = () => {
        closeStream();
      };

      request.signal.addEventListener("abort", abort, { once: true });
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
}
