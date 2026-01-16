import { supabase } from "@/lib/supabase";
import type {
  ModerationDefaults,
  ModerationDefaultsInput,
  ModerationSettingsRow,
} from "@/types/supabase";
import { mapDefaultsRow } from "@/src/lib/moderation/mappers";
import {
  mergeUnique,
  normalizeKeywords,
  normalizePhoneNumbers,
} from "@/src/lib/moderation/normalize";
import { requireDefaultsConfigured } from "@/src/lib/moderation/validators";
import {
  defaultSettings,
  settingsSelect,
} from "@/src/lib/moderation/settings-constants";

const defaultsSelect =
  "id, user_id, blocked_keywords, allowlist_phone_numbers, created_at, updated_at";

export const getDefaultsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("moderation_defaults")
    .select(defaultsSelect)
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to load moderation defaults.");
  }

  return data ? mapDefaultsRow(data) : null;
};

export const updateModerationDefaults = async (
  userId: string,
  input: ModerationDefaultsInput,
): Promise<ModerationDefaults> => {
  const current = await getDefaultsForUser(userId);
  const sanitizedKeywords = normalizeKeywords(input.blockedKeywords);
  const sanitizedAllowlistNumbers = normalizePhoneNumbers(
    input.allowlistPhoneNumbers,
  );

  const next: ModerationDefaults = {
    userId,
    blockedKeywords: sanitizedKeywords ?? current?.blockedKeywords ?? [],
    allowlistPhoneNumbers:
      sanitizedAllowlistNumbers ?? current?.allowlistPhoneNumbers ?? [],
  };

  const { data, error } = await supabase
    .from("moderation_defaults")
    .upsert(
      {
        user_id: userId,
        blocked_keywords: next.blockedKeywords,
        allowlist_phone_numbers: next.allowlistPhoneNumbers,
      },
      { onConflict: "user_id" },
    )
    .select(defaultsSelect)
    .single();

  if (error || !data) {
    throw new Error("Failed to update moderation defaults.");
  }

  return mapDefaultsRow(data);
};

export const applyDefaultsToGroups = async (
  userId: string,
  groupIds: string[],
) => {
  const uniqueGroupIds = Array.from(
    new Set(groupIds.filter((id) => typeof id === "string" && id.length > 0)),
  );

  if (uniqueGroupIds.length === 0) {
    throw new Error("Select at least one group.");
  }

  const defaults = await getDefaultsForUser(userId);
  requireDefaultsConfigured(
    Boolean(
      defaults &&
        (defaults.allowlistPhoneNumbers.length > 0 ||
          defaults.blockedKeywords.length > 0),
    ),
  );

  const { data: groupRows, error: groupError } = await supabase
    .from("moderation_groups")
    .select("id")
    .eq("user_id", userId)
    .in("id", uniqueGroupIds);

  if (groupError) {
    throw new Error("Failed to load groups.");
  }

  const allowedGroupIds = (groupRows ?? []).map((group) => group.id);

  if (allowedGroupIds.length === 0) {
    throw new Error("No matching groups found.");
  }

  const { data: existingSettings, error: settingsError } = await supabase
    .from("moderation_settings")
    .select(settingsSelect)
    .eq("user_id", userId)
    .in("group_id", allowedGroupIds);

  if (settingsError) {
    throw new Error("Failed to load moderation settings.");
  }

  const settingsByGroup = new Map(
    (existingSettings ?? []).map((row) => [row.group_id, row]),
  );

  const updates = allowedGroupIds.map((groupId) => {
    const current = settingsByGroup.get(groupId) as ModerationSettingsRow | null;
    const currentKeywords = current?.blocked_keywords ?? [];
    const currentAllowlist = current?.allowlist_phone_numbers ?? [];

    return {
      user_id: userId,
      group_id: groupId,
      block_phone_numbers:
        current?.block_phone_numbers ?? defaultSettings.block_phone_numbers,
      block_links: current?.block_links ?? defaultSettings.block_links,
      block_group_invites:
        current?.block_group_invites ?? defaultSettings.block_group_invites,
      block_keywords: current?.block_keywords ?? defaultSettings.block_keywords,
      spam_protection_enabled:
        current?.spam_protection_enabled ??
        defaultSettings.spam_protection_enabled,
      blocked_keywords: mergeUnique(
        currentKeywords,
        defaults?.blockedKeywords ?? [],
      ),
      allowlist_phone_numbers: mergeUnique(
        currentAllowlist,
        defaults?.allowlistPhoneNumbers ?? [],
      ),
    };
  });

  const { error: updateError } = await supabase
    .from("moderation_settings")
    .upsert(updates, { onConflict: "group_id" });

  if (updateError) {
    throw new Error("Failed to apply defaults.");
  }

  return { updatedGroupIds: allowedGroupIds };
};
