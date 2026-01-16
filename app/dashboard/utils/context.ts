import type { ModerationContext } from "@/types/supabase";
import type { DashboardStateSetters } from "@/app/dashboard/types";
import { defaultToggles, fallbackKeywords } from "./constants";

const applyFallbacks = (
  data: ModerationContext,
  setters: Pick<DashboardStateSetters, "setKeywords" | "setAllowlistNumbers">,
) => {
  const nextFallbackKeywords =
    data.defaults?.blockedKeywords && data.defaults.blockedKeywords.length > 0
      ? data.defaults.blockedKeywords
      : fallbackKeywords;
  const nextFallbackAllowlist = data.defaults?.allowlistPhoneNumbers ?? [];
  setters.setKeywords(nextFallbackKeywords);
  setters.setAllowlistNumbers(nextFallbackAllowlist);
};

export const applyContextState = (
  data: ModerationContext,
  setters: DashboardStateSetters,
) => {
  setters.setGroups(data.groups);
  setters.setActiveGroupId(data.activeGroupId);
  setters.setSharedKeywords(data.defaults?.blockedKeywords ?? []);
  setters.setSharedAllowlistNumbers(data.defaults?.allowlistPhoneNumbers ?? []);

  if (data.settings) {
    setters.setToggles({
      phoneNumbers: data.settings.blockPhoneNumbers,
      links: data.settings.blockLinks,
      groupInvites: data.settings.blockGroupInvites,
      keywords: data.settings.blockKeywords,
      spamProtection: data.settings.spamProtectionEnabled,
    });
    setters.setKeywords(data.settings.blockedKeywords ?? []);
    setters.setAllowlistNumbers(data.settings.allowlistPhoneNumbers ?? []);
  } else {
    setters.setToggles(defaultToggles);
    applyFallbacks(data, setters);
  }
};

export const resetOnError = (setters: DashboardStateSetters) => {
  setters.setToggles(defaultToggles);
  setters.setKeywords(fallbackKeywords);
  setters.setAllowlistNumbers([]);
  setters.setSharedKeywords([]);
  setters.setSharedAllowlistNumbers([]);
  setters.setGroups([]);
  setters.setActiveGroupId(null);
};
