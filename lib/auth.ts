import { cookies } from "next/headers";

import { findDemoProfileByEmail, ensureProfileFromAuth, getProfileById } from "@/lib/repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const DEMO_SESSION_COOKIE = "cypher_demo_user";

export interface ViewerContext {
  profile: Profile | null;
  mode: "supabase" | "demo" | "guest";
}

export async function getViewerContext(): Promise<ViewerContext> {
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      const profile = await ensureProfileFromAuth({
        id: user.id,
        email: user.email,
        displayName:
          typeof user.user_metadata?.display_name === "string"
            ? user.user_metadata.display_name
            : user.email.split("@")[0],
      });

      return { profile, mode: "supabase" };
    }
  }

  const cookieStore = await cookies();
  const demoProfileId = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (!demoProfileId) {
    return { profile: null, mode: "guest" };
  }

  const profile = await getProfileById(demoProfileId);
  return { profile, mode: profile ? "demo" : "guest" };
}

export async function getDemoProfileForEmail(email: string) {
  return findDemoProfileByEmail(email);
}
