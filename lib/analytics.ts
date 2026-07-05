import { env, isPosthogConfigured } from "@/lib/env";

export async function trackServerEvent(input: {
  event: string;
  distinctId: string;
  properties?: Record<string, unknown>;
}) {
  if (!isPosthogConfigured()) {
    return;
  }

  await fetch(`${env.posthogHost}/capture/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: env.posthogKey,
      event: input.event,
      properties: {
        distinct_id: input.distinctId,
        ...input.properties,
      },
    }),
  });
}
