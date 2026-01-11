import { supabase } from "@/lib/supabase";
import type {
  ModerationContext,
  ModerationSettings,
  ModerationSettingsInput,
  ModerationSettingsRow,
} from "@/types/supabase";
import { mapGroupRow, mapSettingsRow } from "@/src/lib/moderation/mappers";
import {
  normalizeKeywords,
  normalizePhoneNumbers,
} from "@/src/lib/moderation/normalize";
import { settingsSelect } from "@/src/lib/moderation/settings-constants";
import { getGroupForUser, getGroupsForUser } from "./groups.service";
import { getDefaultsForUser } from "./defaults.service";

export const getSettingsRowForGroup = async (
  userId: string,
  groupId: string,
) => {
  const { data, error } = await supabase
    .from("moderation_settings")
    .select(settingsSelect)
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to load moderation settings.");
  }

  return data ?? null;
};

const buildNextSettings = (
  userId: string,
  groupId: string,
  input: ModerationSettingsInput,
  current?: ModerationSettings | null,
): ModerationSettings => {
  const sanitizedKeywords = normalizeKeywords(input.blockedKeywords);
  const sanitizedAdminNumbers = normalizePhoneNumbers(input.adminPhoneNumbers);

  return {
    userId,
    groupId,
    blockPhoneNumbers:
      input.blockPhoneNumbers ?? current?.blockPhoneNumbers ?? false,
    blockLinks: input.blockLinks ?? current?.blockLinks ?? false,
    blockKeywords: input.blockKeywords ?? current?.blockKeywords ?? false,
    spamProtectionEnabled:
      input.spamProtectionEnabled ?? current?.spamProtectionEnabled ?? false,
    blockedKeywords: sanitizedKeywords ?? current?.blockedKeywords ?? [],
    adminPhoneNumbers:
      sanitizedAdminNumbers ?? current?.adminPhoneNumbers ?? [],
  };
};

export const upsertModerationSettings = async (
  userId: string,
  groupId: string,
  input: ModerationSettingsInput,
): Promise<ModerationSettings> => {
  const currentRow = await getSettingsRowForGroup(userId, groupId);
  const current = currentRow ? mapSettingsRow(currentRow) : null;
  const next = buildNextSettings(userId, groupId, input, current);

  const { data, error } = await supabase
    .from("moderation_settings")
    .upsert(
      {
        user_id: userId,
        group_id: groupId,
        block_phone_numbers: next.blockPhoneNumbers,
        block_links: next.blockLinks,
        block_keywords: next.blockKeywords,
        spam_protection_enabled: next.spamProtectionEnabled,
        blocked_keywords: next.blockedKeywords,
        admin_phone_numbers: next.adminPhoneNumbers,
      },
      { onConflict: "group_id" },
    )
    .select(settingsSelect)
    .single();

  if (error || !data) {
    throw new Error("Failed to update moderation settings.");
  }

  return mapSettingsRow(data);
};

export const updateModerationSettingsForGroup = async (
  userId: string,
  groupId: string,
  input: ModerationSettingsInput,
) => {
  const group = await getGroupForUser(userId, groupId);

  if (!group) {
    throw new Error("Group not found.");
  }

  return upsertModerationSettings(userId, groupId, input);
};

export const getModerationContext = async (
  userId: string,
  groupId?: string,
): Promise<ModerationContext> => {
  const groupRows = await getGroupsForUser(userId);
  const groups = groupRows.map(mapGroupRow);
  const defaults = await getDefaultsForUser(userId);
  const activeGroup =
    (groupId && groupRows.find((group) => group.id === groupId)) ||
    groupRows[0] ||
    null;

  if (!activeGroup) {
    return { groups, activeGroupId: null, settings: null, defaults };
  }

  const settingsRow = await getSettingsRowForGroup(userId, activeGroup.id);

  return {
    groups,
    activeGroupId: activeGroup.id,
    settings: settingsRow ? mapSettingsRow(settingsRow) : null,
    defaults,
  };
};
