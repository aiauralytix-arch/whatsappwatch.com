"use server";

import { currentUser } from "@clerk/nextjs/server";

import type { ModerationDefaultsInput } from "@/types/supabase";
import {
  applyDefaultsToGroups,
  updateModerationDefaults as updateDefaults,
} from "@/src/services/moderation/defaults.service";
import { upsertUserProfile } from "@/src/services/moderation/user.service";

export async function updateModerationDefaults(
  input: ModerationDefaultsInput,
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await upsertUserProfile(user);

  return updateDefaults(user.id, input);
}

export async function applyModerationDefaultsToGroups(groupIds: string[]) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return applyDefaultsToGroups(user.id, groupIds);
}
