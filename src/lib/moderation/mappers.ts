import type {
  ModerationDefaults,
  ModerationDefaultsRow,
  ModerationDeletedMessage,
  ModerationDeletedMessageRow,
  ModerationGroup,
  ModerationGroupRow,
  ModerationSettings,
  ModerationSettingsRow,
} from "@/types/supabase";

export const mapGroupRow = (row: ModerationGroupRow): ModerationGroup => ({
  id: row.id,
  userId: row.user_id,
  groupLink: row.group_link,
  groupName: row.group_name,
  subscriptionPriceInr: row.subscription_price_inr,
  subscriptionStatus: row.subscription_status,
  isVerified: row.is_verified,
  verifiedAt: row.verified_at,
  verifiedWhapiGroupId: row.verified_whapi_group_id,
});

export const mapSettingsRow = (
  row: ModerationSettingsRow,
): ModerationSettings => ({
  userId: row.user_id,
  groupId: row.group_id,
  blockPhoneNumbers: row.block_phone_numbers,
  blockLinks: row.block_links,
  blockGroupInvites: row.block_group_invites,
  blockKeywords: row.block_keywords,
  spamProtectionEnabled: row.spam_protection_enabled,
  blockedKeywords: row.blocked_keywords ?? [],
  allowlistPhoneNumbers: row.allowlist_phone_numbers ?? [],
});

export const mapDefaultsRow = (
  row: ModerationDefaultsRow,
): ModerationDefaults => ({
  userId: row.user_id,
  blockedKeywords: row.blocked_keywords ?? [],
  allowlistPhoneNumbers: row.allowlist_phone_numbers ?? [],
});

export const mapDeletedMessageRow = (
  row: ModerationDeletedMessageRow,
): ModerationDeletedMessage => ({
  id: row.id,
  userId: row.user_id,
  groupId: row.group_id,
  whapiGroupId: row.whapi_group_id,
  whapiMessageId: row.whapi_message_id,
  senderId: row.sender_id,
  senderKey: row.sender_key,
  messageText: row.message_text,
  messageTimestamp: row.message_timestamp,
  matchedKeywords: row.matched_keywords ?? [],
  hasUrl: row.has_url,
  hasNumber: row.has_number,
  spamTriggered: row.spam_triggered,
  createdAt: row.created_at,
});
