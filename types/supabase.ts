export type UserRow = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  name: string | null;
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
};

export type ModerationSettingsRow = {
  id: string;
  user_id: string;
  group_id: string;
  block_phone_numbers: boolean;
  block_links: boolean;
  block_keywords: boolean;
  spam_protection_enabled: boolean;
  blocked_keywords: string[];
  admin_phone_numbers: string[];
};

export type ModerationSettings = {
  userId: string;
  groupId: string;
  blockPhoneNumbers: boolean;
  blockLinks: boolean;
  blockKeywords: boolean;
  spamProtectionEnabled: boolean;
  blockedKeywords: string[];
  adminPhoneNumbers: string[];
};

export type ModerationSettingsInput = {
  blockPhoneNumbers?: boolean;
  blockLinks?: boolean;
  blockKeywords?: boolean;
  spamProtectionEnabled?: boolean;
  blockedKeywords?: string[];
  adminPhoneNumbers?: string[];
};

export type ModerationDefaultsRow = {
  id: string;
  user_id: string;
  blocked_keywords: string[];
  admin_phone_numbers: string[];
  created_at: string;
  updated_at: string;
};

export type ModerationDefaults = {
  userId: string;
  blockedKeywords: string[];
  adminPhoneNumbers: string[];
};

export type ModerationDefaultsInput = {
  blockedKeywords?: string[];
  adminPhoneNumbers?: string[];
};

export type ModerationContext = {
  groups: ModerationGroup[];
  activeGroupId: string | null;
  settings: ModerationSettings | null;
  defaults: ModerationDefaults | null;
};
