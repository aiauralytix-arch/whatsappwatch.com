"use server";

import { auth, currentUser } from '@clerk/nextjs/server';

import { supabase } from "@/lib/supabase";

export type ModerationSettingsInput = {
  blockPhoneNumbers?: boolean;
  blockLinks?: boolean;
  blockKeywords?: boolean;
  spamProtectionEnabled?: boolean;
  blockedKeywords?: string[];
};

type UserProfileInput = {
  name?: string;
  email?: string;
};

type ModerationSettingsState = {
  userId: string;
  blockPhoneNumbers: boolean;
  blockLinks: boolean;
  blockKeywords: boolean;
  spamProtectionEnabled: boolean;
  blockedKeywords: string[];
};

type ModerationSettingsRow = {
  user_id: string;
  block_phone_numbers: boolean;
  block_links: boolean;
  block_keywords: boolean;
  spam_protection_enabled: boolean;
  blocked_keywords: string[];
};

const mapSettingsRow = (row: ModerationSettingsRow): ModerationSettingsState => ({
  userId: row.user_id,
  blockPhoneNumbers: row.block_phone_numbers,
  blockLinks: row.block_links,
  blockKeywords: row.block_keywords,
  spamProtectionEnabled: row.spam_protection_enabled,
  blockedKeywords: row.blocked_keywords ?? [],
});

export async function getModerationSettings() {
  const userId = "21312311212"

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("moderation_settings")
    .select(
      "user_id, block_phone_numbers, block_links, block_keywords, spam_protection_enabled, blocked_keywords",
    )
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    return null;
  }

  return data ? mapSettingsRow(data) : null;
}

export async function updateModerationSettings(
  input: ModerationSettingsInput,
  userProfile?: UserProfileInput,
) {
  const { isAuthenticated } = await auth()
  const user = await currentUser()

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: currentData } = await supabase
    .from("moderation_settings")
    .select(
      "user_id, block_phone_numbers, block_links, block_keywords, spam_protection_enabled, blocked_keywords",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const current = currentData ? mapSettingsRow(currentData) : null;

  const next: ModerationSettingsState = {
    userId: user.id,
    blockPhoneNumbers:
      input.blockPhoneNumbers ?? current?.blockPhoneNumbers ?? false,
    blockLinks: input.blockLinks ?? current?.blockLinks ?? false,
    blockKeywords: input.blockKeywords ?? current?.blockKeywords ?? false,
    spamProtectionEnabled:
      input.spamProtectionEnabled ?? current?.spamProtectionEnabled ?? false,
    blockedKeywords: input.blockedKeywords ?? current?.blockedKeywords ?? [],
  };

  const { error: userError } = await supabase.from("users").upsert(
    {
      clerk_user_id: user.id,
      name: userProfile?.name ?? null,
      email: userProfile?.email ?? null,
    },
    { onConflict: "clerk_user_id" },
  );

  if (userError) {
    throw new Error("Failed to upsert user profile.");
  }

  const { data, error } = await supabase
    .from("moderation_settings")
    .upsert(
      {
        user_id: user.id,
        block_phone_numbers: next.blockPhoneNumbers,
        block_links: next.blockLinks,
        block_keywords: next.blockKeywords,
        spam_protection_enabled: next.spamProtectionEnabled,
        blocked_keywords: next.blockedKeywords,
      },
      { onConflict: "user_id" },
    )
    .select(
      "user_id, block_phone_numbers, block_links, block_keywords, spam_protection_enabled, blocked_keywords",
    )
    .single();

  if (error || !data) {
    throw new Error("Failed to upsert moderation settings.");
  }

  return mapSettingsRow(data);
}
