import { jsonError } from "@/lib/utils";

export async function POST() {
  return jsonError("帖子反应接口已退役，请改用 /api/pets/:petId/actions。", 410);
}
