import { getViewerContext } from "@/lib/auth";
import { getHomeSignals } from "@/lib/repository";
import { jsonError, jsonOk } from "@/lib/utils";

export async function GET() {
  try {
    const { profile } = await getViewerContext();
    const feed = await getHomeSignals({
      viewerId: profile?.id,
      viewerName: profile?.displayName,
    });

    return jsonOk(
      { feed },
      {
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "home-signals-failed", 500);
  }
}
