import { readFile } from "node:fs/promises";
import path from "node:path";

import { jsonError } from "@/lib/utils";

export const runtime = "nodejs";

const FILENAME_PATTERN = /^generated-[a-z0-9-]+\.svg$/i;

// Runtime-generated sprites live in public/generated, but files written after
// `next build` are not served from /public in production — this route streams
// them from disk in both dev and prod.
export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;

  if (!FILENAME_PATTERN.test(filename)) {
    return jsonError("not-found", 404);
  }

  try {
    const filePath = path.join(process.cwd(), "public", "generated", filename);
    const svg = await readFile(filePath, "utf8");

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return jsonError("not-found", 404);
  }
}
