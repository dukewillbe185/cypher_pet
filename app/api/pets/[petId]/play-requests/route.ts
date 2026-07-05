import { jsonError } from "@/lib/utils";

export async function POST() {
  return jsonError("邀玩系统已退役，宠物会在公共花园里自行互动。", 410);
}
