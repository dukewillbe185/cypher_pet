import { jsonError } from "@/lib/utils";

export async function POST() {
  return jsonError("帖子系统已下线，Cypher Garden 不再使用广场发帖。", 410);
}
