import { jsonError } from "@/lib/utils";

export async function POST() {
  return jsonError("帖子评论接口已退役，请改用宠物日志与主人动作。", 410);
}
