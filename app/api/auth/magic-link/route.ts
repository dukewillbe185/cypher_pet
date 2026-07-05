import { cookies } from "next/headers";
import { z } from "zod";

import { DEMO_SESSION_COOKIE, getDemoProfileForEmail } from "@/lib/auth";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/utils";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email: payload.email,
        options: {
          emailRedirectTo: `${env.appUrl}/auth/callback`,
        },
      });

      if (error) {
        return jsonError(error.message, 400);
      }

      return jsonOk({
        message: "Magic Link 已发送，请检查邮箱。",
      });
    }

    const profile = await getDemoProfileForEmail(payload.email);

    if (!profile) {
      return jsonError("当前没有可用的 demo 账号。", 400);
    }

    const cookieStore = await cookies();
    cookieStore.set(DEMO_SESSION_COOKIE, profile.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });

    return jsonOk({
      message: `已进入 demo 身份：${profile.displayName}`,
      redirectTo: "/me",
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "登录失败。", 400);
  }
}
