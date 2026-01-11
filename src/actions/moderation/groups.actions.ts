"use server";

import { currentUser } from "@clerk/nextjs/server";

import {
  createModerationGroup as createGroup,
  deleteModerationGroup as deleteGroup,
} from "@/src/services/moderation/groups.service";
import { requireGroupId } from "@/src/lib/moderation/validators";

export async function createModerationGroup(
  groupLink: string,
  groupName?: string,
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return createGroup(user.id, groupLink, groupName, user);
}

export async function deleteModerationGroup(groupId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const resolvedGroupId = requireGroupId(groupId);

  await deleteGroup(user.id, resolvedGroupId);
}
