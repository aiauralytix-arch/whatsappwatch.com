import { supabase } from "@/lib/supabase";
import type { ModerationGroup } from "@/types/supabase";
import { mapGroupRow } from "@/src/lib/moderation/mappers";
import {
  normalizeGroupLink,
  normalizeGroupName,
} from "@/src/lib/moderation/normalize";
import {
  enforceGroupLimit,
  requireGroupLink,
  requireGroupName,
} from "@/src/lib/moderation/validators";
import { getDefaultsForUser } from "./defaults.service";
import { defaultSettings } from "@/src/lib/moderation/settings-constants";
import { upsertUserProfile } from "./user.service";

const maxGroups = 50;
const groupSelect =
  "id, user_id, group_link, group_name, subscription_price_inr, subscription_status, is_verified, verified_at, verified_whapi_group_id, created_at, updated_at";

export const getGroupsForUser = async (userId: string) => {
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

export const getGroupForUser = async (userId: string, groupId: string) => {
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

export const createModerationGroup = async (
  userId: string,
  groupLink: string,
  groupName: string,
  userProfile: Parameters<typeof upsertUserProfile>[0],
): Promise<ModerationGroup> => {
  const normalizedGroupLink = normalizeGroupLink(groupLink);
  const normalizedGroupName = normalizeGroupName(groupName);
  const resolvedGroupName = requireGroupName(normalizedGroupName);

  requireGroupLink(normalizedGroupLink);

  await upsertUserProfile(userProfile);

  const { data: existing, error: existingError } = await supabase
    .from("moderation_groups")
    .select(groupSelect)
    .eq("user_id", userId)
    .eq("group_link", normalizedGroupLink)
    .maybeSingle();

  if (existingError) {
    throw new Error("Failed to check for existing group.");
  }

  if (existing) {
    if (resolvedGroupName !== existing.group_name) {
      const { data: updated, error: updateError } = await supabase
        .from("moderation_groups")
        .update({ group_name: resolvedGroupName })
        .eq("id", existing.id)
        .eq("user_id", userId)
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
    .eq("user_id", userId);

  if (countError) {
    throw new Error("Failed to validate group limit.");
  }

  enforceGroupLimit(count ?? 0, maxGroups);

  const { data, error } = await supabase
    .from("moderation_groups")
    .insert({
      user_id: userId,
      group_link: normalizedGroupLink,
      group_name: resolvedGroupName,
    })
    .select(groupSelect)
    .single();

  if (error || !data) {
    throw new Error("Failed to create group.");
  }

  const defaults = await getDefaultsForUser(userId);
  if (
    defaults &&
    (defaults.allowlistPhoneNumbers.length > 0 ||
      defaults.blockedKeywords.length > 0)
  ) {
    const { error: settingsError } = await supabase
      .from("moderation_settings")
      .upsert(
        {
          user_id: userId,
          group_id: data.id,
          block_phone_numbers: defaultSettings.block_phone_numbers,
          block_links: defaultSettings.block_links,
          block_group_invites: defaultSettings.block_group_invites,
          block_contacts: defaultSettings.block_contacts,
          block_keywords: defaultSettings.block_keywords,
          blocked_keywords: defaults.blockedKeywords,
          allowlist_phone_numbers: defaults.allowlistPhoneNumbers,
        },
        { onConflict: "group_id" },
      );

    if (settingsError) {
      throw new Error("Failed to apply default settings.");
    }
  }

  return mapGroupRow(data);
};

export const deleteModerationGroup = async (
  userId: string,
  groupId: string,
) => {
  const group = await getGroupForUser(userId, groupId);
  if (!group) {
    throw new Error("Group not found.");
  }

  const { error } = await supabase
    .from("moderation_groups")
    .delete()
    .eq("id", groupId)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to delete group.");
  }
};

export const updateModerationGroupName = async (
  userId: string,
  groupId: string,
  groupName: string,
): Promise<ModerationGroup> => {
  const group = await getGroupForUser(userId, groupId);
  if (!group) {
    throw new Error("Group not found.");
  }

  const normalizedGroupName = normalizeGroupName(groupName);
  const nextName = requireGroupName(normalizedGroupName);

  if (nextName === group.group_name) {
    return mapGroupRow(group);
  }

  const { data, error } = await supabase
    .from("moderation_groups")
    .update({ group_name: nextName })
    .eq("id", groupId)
    .eq("user_id", userId)
    .select(groupSelect)
    .single();

  if (error || !data) {
    throw new Error("Failed to update group name.");
  }

  return mapGroupRow(data);
};

export const updateModerationGroupVerification = async (
  userId: string,
  groupId: string,
  whapiGroupId: string,
): Promise<ModerationGroup> => {
  const group = await getGroupForUser(userId, groupId);
  if (!group) {
    throw new Error("Group not found.");
  }

  const { data, error } = await supabase
    .from("moderation_groups")
    .update({
      is_verified: true,
      verified_at: new Date().toISOString(),
      verified_whapi_group_id: whapiGroupId,
    })
    .eq("id", groupId)
    .eq("user_id", userId)
    .select(groupSelect)
    .single();

  if (error || !data) {
    throw new Error("Failed to verify group.");
  }

  return mapGroupRow(data);
};
