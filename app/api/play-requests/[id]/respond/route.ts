import { jsonError } from "@/lib/utils";

export async function POST() {
  return jsonError("邀玩响应接口已退役，Cypher Garden 不再使用请求式互动。", 410);
}
