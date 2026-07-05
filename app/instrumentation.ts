import { initSentry } from "@/lib/sentry";

export async function register() {
  await initSentry();
}
