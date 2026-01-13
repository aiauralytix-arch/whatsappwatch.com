import { supabase } from "@/lib/supabase";
import type { ModerationDeletedMessage } from "@/types/supabase";
import { mapDeletedMessageRow } from "@/src/lib/moderation/mappers";
import { getGroupForUser } from "./groups.service";

const deletedMessagesSelect =
  "id, user_id, group_id, whapi_group_id, whapi_message_id, sender_id, sender_key, message_text, message_timestamp, matched_keywords, has_url, has_number, spam_triggered, created_at";

export const getDeletedMessagesForGroup = async (
  userId: string,
  groupId: string,
  limit = 50,
): Promise<ModerationDeletedMessage[]> => {
  const group = await getGroupForUser(userId, groupId);
  if (!group) {
    throw new Error("Group not found.");
  }

  const { data, error } = await supabase
    .from("moderation_deleted_messages")
    .select(deletedMessagesSelect)
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Failed to load deleted messages.");
  }

  return (data ?? []).map(mapDeletedMessageRow);
};
