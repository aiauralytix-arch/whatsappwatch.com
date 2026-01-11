"use server";

import { currentUser } from "@clerk/nextjs/server";

import { supabase } from "@/lib/supabase";

import type {
  ModerationContext,
  ModerationDefaults,
  ModerationDefaultsInput,
  ModerationDefaultsRow,
  ModerationGroup,
  ModerationGroupRow,
  ModerationSettings,
  ModerationSettingsInput,
  ModerationSettingsRow,
} from "@/types/supabase";

const maxGroups = 50;
const groupSelect =
  "id, user_id, group_link, group_name, subscription_price_inr, subscription_status, created_at, updated_at";
const settingsSelect =
  "id, user_id, group_id, block_phone_numbers, block_links, block_keywords, spam_protection_enabled, blocked_keywords, admin_phone_numbers";
const defaultsSelect =
  "id, user_id, blocked_keywords, admin_phone_numbers, created_at, updated_at";
const defaultSettings = {
  block_phone_numbers: true,
  block_links: true,
  block_keywords: true,
  spam_protection_enabled: false,
};

const mapGroupRow = (row: ModerationGroupRow): ModerationGroup => ({
  id: row.id,
  userId: row.user_id,
  groupLink: row.group_link,
  groupName: row.group_name,
  subscriptionPriceInr: row.subscription_price_inr,
  subscriptionStatus: row.subscription_status,
});

const mapSettingsRow = (row: ModerationSettingsRow): ModerationSettings => ({
  userId: row.user_id,
  groupId: row.group_id,
  blockPhoneNumbers: row.block_phone_numbers,
  blockLinks: row.block_links,
  blockKeywords: row.block_keywords,
  spamProtectionEnabled: row.spam_protection_enabled,
  blockedKeywords: row.blocked_keywords ?? [],
  adminPhoneNumbers: row.admin_phone_numbers ?? [],
});

const mapDefaultsRow = (row: ModerationDefaultsRow): ModerationDefaults => ({
  userId: row.user_id,
  blockedKeywords: row.blocked_keywords ?? [],
  adminPhoneNumbers: row.admin_phone_numbers ?? [],
});

const normalizeGroupLink = (groupLink: string) => {
  const trimmed = groupLink.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 512) {
    throw new Error("Group link is too long.");
  }
  return trimmed;
};

const normalizeGroupName = (groupName?: string) => {
  if (groupName === undefined) return undefined;
  const trimmed = groupName.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > 80) {
    throw new Error("Group name is too long.");
  }
  return trimmed;
};

const normalizeKeywords = (keywords?: string[]) => {
  if (!keywords) return undefined;
  return keywords
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, 100);
};

const normalizePhoneNumbers = (numbers?: string[]) => {
  if (!numbers) return undefined;
  const normalized = numbers
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const cleaned = entry.replace(/[^\d+]/g, "");
      if (!cleaned) return "";
      return cleaned.startsWith("+")
        ? `+${cleaned.slice(1).replace(/\+/g, "")}`
        : cleaned.replace(/\+/g, "");
    })
    .filter(Boolean);
  return Array.from(new Set(normalized)).slice(0, 50);
};

const mergeUnique = (current: string[], next: string[]) =>
  Array.from(new Set([...current, ...next]));

const getModerationDefaultsForUser = async (userId: string) => {
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

const upsertUser = async (user: NonNullable<Awaited<ReturnType<typeof currentUser>>>) => {
  const userName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    null;
  const userEmail = user.primaryEmailAddress?.emailAddress ?? null;

  const { error } = await supabase.from("users").upsert(
    {
      clerk_user_id: user.id,
      name: userName,
      email: userEmail,
    },
    { onConflict: "clerk_user_id" },
  );

  if (error) {
    throw new Error("Failed to upsert user profile.");
  }
};

const getGroupsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("moderation_groups")
    .select(groupSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error("Failed to load groups.");
  }

  return data ?? [];
};

const getGroupForUser = async (userId: string, groupId: string) => {
  const { data, error } = await supabase
    .from("moderation_groups")
    .select(groupSelect)
    .eq("id", groupId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load group.");
  }

  return data ?? null;
};

export async function getModerationSettings(
  groupId?: string,
): Promise<ModerationContext> {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const groupRows = await getGroupsForUser(user.id);
  const groups = groupRows.map(mapGroupRow);
  const defaults = await getModerationDefaultsForUser(user.id);
  const activeGroup =
    (groupId && groupRows.find((group) => group.id === groupId)) ||
    groupRows[0] ||
    null;

  if (!activeGroup) {
    return { groups, activeGroupId: null, settings: null, defaults };
  }

  const { data, error } = await supabase
    .from("moderation_settings")
    .select(settingsSelect)
    .eq("user_id", user.id)
    .eq("group_id", activeGroup.id)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to load moderation settings.");
  }

  return {
    groups,
    activeGroupId: activeGroup.id,
    settings: data ? mapSettingsRow(data) : null,
    defaults,
  };
}

export async function createModerationGroup(
  groupLink: string,
  groupName?: string,
): Promise<ModerationGroup> {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const normalizedGroupLink = normalizeGroupLink(groupLink);
  const normalizedGroupName = normalizeGroupName(groupName);

  if (!normalizedGroupLink) {
    throw new Error("Group link is required.");
  }

  await upsertUser(user);

  const { data: existing, error: existingError } = await supabase
    .from("moderation_groups")
    .select(groupSelect)
    .eq("user_id", user.id)
    .eq("group_link", normalizedGroupLink)
    .maybeSingle();

  if (existingError) {
    throw new Error("Failed to check for existing group.");
  }

  if (existing) {
    if (
      normalizedGroupName !== undefined &&
      normalizedGroupName !== existing.group_name
    ) {
      const { data: updated, error: updateError } = await supabase
        .from("moderation_groups")
        .update({ group_name: normalizedGroupName })
        .eq("id", existing.id)
        .eq("user_id", user.id)
        .select(groupSelect)
        .single();

      if (updateError || !updated) {
        throw new Error("Failed to update group name.");
      }

      return mapGroupRow(updated);
    }

    return mapGroupRow(existing);
  }

  const { count, error: countError } = await supabase
    .from("moderation_groups")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    throw new Error("Failed to validate group limit.");
  }

  if ((count ?? 0) >= maxGroups) {
    throw new Error("Group limit reached.");
  }

  const { data, error } = await supabase
    .from("moderation_groups")
    .insert({
      user_id: user.id,
      group_link: normalizedGroupLink,
      group_name: normalizedGroupName ?? null,
    })
    .select(groupSelect)
    .single();

  if (error || !data) {
    throw new Error("Failed to create group.");
  }

  const defaults = await getModerationDefaultsForUser(user.id);
  if (
    defaults &&
    (defaults.adminPhoneNumbers.length > 0 || defaults.blockedKeywords.length > 0)
  ) {
    const { error: settingsError } = await supabase
      .from("moderation_settings")
      .upsert(
        {
          user_id: user.id,
          group_id: data.id,
          block_phone_numbers: defaultSettings.block_phone_numbers,
          block_links: defaultSettings.block_links,
          block_keywords: defaultSettings.block_keywords,
          spam_protection_enabled: defaultSettings.spam_protection_enabled,
          blocked_keywords: defaults.blockedKeywords,
          admin_phone_numbers: defaults.adminPhoneNumbers,
        },
        { onConflict: "group_id" },
      );

    if (settingsError) {
      throw new Error("Failed to apply default settings.");
    }
  }

  return mapGroupRow(data);
}

export async function updateModerationDefaults(
  input: ModerationDefaultsInput,
): Promise<ModerationDefaults> {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await upsertUser(user);

  const current = await getModerationDefaultsForUser(user.id);
  const sanitizedKeywords = normalizeKeywords(input.blockedKeywords);
  const sanitizedAdminNumbers = normalizePhoneNumbers(input.adminPhoneNumbers);

  const next: ModerationDefaults = {
    userId: user.id,
    blockedKeywords: sanitizedKeywords ?? current?.blockedKeywords ?? [],
    adminPhoneNumbers:
      sanitizedAdminNumbers ?? current?.adminPhoneNumbers ?? [],
  };

  const { data, error } = await supabase
    .from("moderation_defaults")
    .upsert(
      {
        user_id: user.id,
        blocked_keywords: next.blockedKeywords,
        admin_phone_numbers: next.adminPhoneNumbers,
      },
      { onConflict: "user_id" },
    )
    .select(defaultsSelect)
    .single();

  if (error || !data) {
    throw new Error("Failed to update moderation defaults.");
  }

  return mapDefaultsRow(data);
}

export async function applyModerationDefaultsToGroups(
  groupIds: string[],
): Promise<{ updatedGroupIds: string[] }> {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const uniqueGroupIds = Array.from(
    new Set(groupIds.filter((id) => typeof id === "string" && id.length > 0)),
  );

  if (uniqueGroupIds.length === 0) {
    throw new Error("Select at least one group.");
  }

  const defaults = await getModerationDefaultsForUser(user.id);

  if (
    !defaults ||
    (defaults.adminPhoneNumbers.length === 0 &&
      defaults.blockedKeywords.length === 0)
  ) {
    throw new Error("No default lists configured.");
  }

  const { data: groupRows, error: groupError } = await supabase
    .from("moderation_groups")
    .select("id")
    .eq("user_id", user.id)
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
    .eq("user_id", user.id)
    .in("group_id", allowedGroupIds);

  if (settingsError) {
    throw new Error("Failed to load moderation settings.");
  }

  const settingsByGroup = new Map(
    (existingSettings ?? []).map((row) => [row.group_id, row]),
  );

  const updates = allowedGroupIds.map((groupId) => {
    const current = settingsByGroup.get(groupId);
    const currentKeywords = current?.blocked_keywords ?? [];
    const currentAdmins = current?.admin_phone_numbers ?? [];

    return {
      user_id: user.id,
      group_id: groupId,
      block_phone_numbers:
        current?.block_phone_numbers ?? defaultSettings.block_phone_numbers,
      block_links: current?.block_links ?? defaultSettings.block_links,
      block_keywords: current?.block_keywords ?? defaultSettings.block_keywords,
      spam_protection_enabled:
        current?.spam_protection_enabled ??
        defaultSettings.spam_protection_enabled,
      blocked_keywords: mergeUnique(currentKeywords, defaults.blockedKeywords),
      admin_phone_numbers: mergeUnique(
        currentAdmins,
        defaults.adminPhoneNumbers,
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
}

export async function deleteModerationGroup(groupId: string): Promise<void> {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  if (!groupId) {
    throw new Error("Group is required.");
  }

  const group = await getGroupForUser(user.id, groupId);

  if (!group) {
    throw new Error("Group not found.");
  }

  const { error } = await supabase
    .from("moderation_groups")
    .delete()
    .eq("id", groupId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error("Failed to delete group.");
  }
}

export async function updateModerationSettings(
  input: ModerationSettingsInput,
  options?: { groupId?: string },
): Promise<ModerationSettings> {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const groupId = options?.groupId;

  if (!groupId) {
    throw new Error("Group is required.");
  }

  const group = await getGroupForUser(user.id, groupId);
  if (!group) {
    throw new Error("Group not found.");
  }

  await upsertUser(user);

  const { data: currentData, error: currentError } = await supabase
    .from("moderation_settings")
    .select(settingsSelect)
    .eq("user_id", user.id)
    .eq("group_id", groupId)
    .maybeSingle();

  if (currentError && currentError.code !== "PGRST116") {
    throw new Error("Failed to load moderation settings.");
  }

  const current = currentData ? mapSettingsRow(currentData) : null;
  const sanitizedKeywords = normalizeKeywords(input.blockedKeywords);
  const sanitizedAdminNumbers = normalizePhoneNumbers(input.adminPhoneNumbers);

  const next: ModerationSettings = {
    userId: user.id,
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

  const { data, error } = await supabase
    .from("moderation_settings")
    .upsert(
      {
        user_id: user.id,
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
}
