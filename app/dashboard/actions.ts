"use server";

import { currentUser } from "@clerk/nextjs/server";

import { supabase } from "@/lib/supabase";

import type {
  ModerationSettings,
  ModerationSettingsInput,
  ModerationSettingsRow,
} from "@/types/supabase";

type UserProfileInput = {
  name?: string;
  email?: string;
};

const mapSettingsRow = (row: ModerationSettingsRow): ModerationSettings => ({
  userId: row.user_id,
  blockPhoneNumbers: row.block_phone_numbers,
  blockLinks: row.block_links,
  blockKeywords: row.block_keywords,
  spamProtectionEnabled: row.spam_protection_enabled,
  blockedKeywords: row.blocked_keywords ?? [],
});

export async function getModerationSettings() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("moderation_settings")
    .select(
      "user_id, block_phone_numbers, block_links, block_keywords, spam_protection_enabled, blocked_keywords",
    )
    .eq("user_id", user.id)
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
  const user = await currentUser();

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

  const next: ModerationSettings = {
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
