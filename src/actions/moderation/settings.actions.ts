"use server";

import { currentUser } from "@clerk/nextjs/server";

import type { ModerationSettingsInput } from "@/types/supabase";
import {
  getModerationContext,
  updateModerationSettingsForGroup,
} from "@/src/services/moderation/settings.service";
import { requireGroupId } from "@/src/lib/moderation/validators";

export async function getModerationSettings(
  groupId?: string,
): ReturnType<typeof getModerationContext> {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return getModerationContext(user.id, groupId);
}

export async function updateModerationSettings(
  input: ModerationSettingsInput,
  options?: { groupId?: string },
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const resolvedGroupId = requireGroupId(options?.groupId);
  return updateModerationSettingsForGroup(user.id, resolvedGroupId, input);
}
