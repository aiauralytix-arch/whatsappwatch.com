export type UserRow = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  name: string | null;
  phone_number: string | null;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ModerationGroupRow = {
  id: string;
  user_id: string;
  group_link: string | null;
  group_name: string | null;
  subscription_price_inr: number;
  subscription_status: string;
  is_verified: boolean;
  verified_at: string | null;
  verified_whapi_group_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ModerationGroup = {
  id: string;
  userId: string;
  groupLink: string | null;
  groupName: string | null;
  subscriptionPriceInr: number;
  subscriptionStatus: string;
  isVerified: boolean;
  verifiedAt: string | null;
  verifiedWhapiGroupId: string | null;
};

export type ModerationSettingsRow = {
  id: string;
  user_id: string;
  group_id: string;
  block_phone_numbers: boolean;
  block_links: boolean;
  block_group_invites: boolean;
  block_contacts: boolean;
  block_keywords: boolean;
  blocked_keywords: string[];
  allowlist_phone_numbers: string[];
};

export type ModerationSettings = {
  userId: string;
  groupId: string;
  blockPhoneNumbers: boolean;
  blockLinks: boolean;
  blockGroupInvites: boolean;
  blockContacts: boolean;
  blockKeywords: boolean;
  blockedKeywords: string[];
  allowlistPhoneNumbers: string[];
};

export type ModerationSettingsInput = {
  blockPhoneNumbers?: boolean;
  blockLinks?: boolean;
  blockGroupInvites?: boolean;
  blockContacts?: boolean;
  blockKeywords?: boolean;
  blockedKeywords?: string[];
  allowlistPhoneNumbers?: string[];
};

export type ModerationDefaultsRow = {
  id: string;
  user_id: string;
  blocked_keywords: string[];
  allowlist_phone_numbers: string[];
  created_at: string;
  updated_at: string;
};

export type ModerationDefaults = {
  userId: string;
  blockedKeywords: string[];
  allowlistPhoneNumbers: string[];
};

export type ModerationDefaultsInput = {
  blockedKeywords?: string[];
  allowlistPhoneNumbers?: string[];
};

export type ModerationDeletedMessageRow = {
  id: string;
  user_id: string;
  group_id: string | null;
  whapi_group_id: string;
  whapi_message_id: string;
  sender_id: string | null;
  sender_key: string | null;
  message_text: string;
  message_timestamp: string | null;
  matched_keywords: string[];
  has_url: boolean;
  has_number: boolean;
  spam_triggered: boolean;
  created_at: string;
};

export type ModerationDeletedMessage = {
  id: string;
  userId: string;
  groupId: string | null;
  whapiGroupId: string;
  whapiMessageId: string;
  senderId: string | null;
  senderKey: string | null;
  messageText: string;
  messageTimestamp: string | null;
  matchedKeywords: string[];
  hasUrl: boolean;
  hasNumber: boolean;
  spamTriggered: boolean;
  createdAt: string;
};

export type ModerationContext = {
  groups: ModerationGroup[];
  activeGroupId: string | null;
  settings: ModerationSettings | null;
  defaults: ModerationDefaults | null;
};

export type PhoneVerificationRow = {
  id: string;
  user_id: string;
  phone_number: string;
  otp_hash: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
};
