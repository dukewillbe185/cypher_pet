import { jsonError } from "@/lib/utils";

export async function GET() {
  return jsonError("Cypher Plaza 已退役，请改用 /api/garden/snapshot。", 410);
}
