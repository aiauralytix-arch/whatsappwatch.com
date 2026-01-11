"use server";

import { currentUser } from "@clerk/nextjs/server";

import {
  createModerationGroup as createGroup,
  deleteModerationGroup as deleteGroup,
  updateModerationGroupName as updateGroupName,
  updateModerationGroupVerification as updateGroupVerification,
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

export async function updateModerationGroupName(
  groupId: string,
  groupName: string,
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const resolvedGroupId = requireGroupId(groupId);

  return updateGroupName(user.id, resolvedGroupId, groupName);
}

export async function verifyModerationGroup(
  groupId: string,
  whapiGroupId: string,
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const resolvedGroupId = requireGroupId(groupId);

  if (!whapiGroupId.trim()) {
    throw new Error("Invalid Whapi group id.");
  }

  return updateGroupVerification(user.id, resolvedGroupId, whapiGroupId);
}
