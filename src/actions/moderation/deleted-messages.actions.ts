"use server";

import { currentUser } from "@clerk/nextjs/server";

import { requireGroupId } from "@/src/lib/moderation/validators";
import { getDeletedMessagesForGroup } from "@/src/services/moderation/deleted-messages.service";

export async function getDeletedMessages(groupId?: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const resolvedGroupId = requireGroupId(groupId);
  return getDeletedMessagesForGroup(user.id, resolvedGroupId);
}
