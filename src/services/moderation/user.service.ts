import type { currentUser } from "@clerk/nextjs/server";

import { supabase } from "@/lib/supabase";

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

export const upsertUserProfile = async (user: ClerkUser) => {
  const userName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    null;
  const userEmail = user.primaryEmailAddress?.emailAddress ?? null;

  const { error } = await supabase.from("users").upsert(
    {
      clerk_user_id: user.id,
      name: userName,
      email: userEmail,
    },
    { onConflict: "clerk_user_id" },
  );

  if (error) {
    throw new Error("Failed to upsert user profile.");
  }
};
