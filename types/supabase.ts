export type UserRow = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
};

export type ModerationSettingsRow = {
  user_id: string;
  block_phone_numbers: boolean;
  block_links: boolean;
  block_keywords: boolean;
  spam_protection_enabled: boolean;
  blocked_keywords: string[];
};

export type ModerationSettings = {
  userId: string;
  blockPhoneNumbers: boolean;
  blockLinks: boolean;
  blockKeywords: boolean;
  spamProtectionEnabled: boolean;
  blockedKeywords: string[];
};

export type ModerationSettingsInput = {
  blockPhoneNumbers?: boolean;
  blockLinks?: boolean;
  blockKeywords?: boolean;
  spamProtectionEnabled?: boolean;
  blockedKeywords?: string[];
};
