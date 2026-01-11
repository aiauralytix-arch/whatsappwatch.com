import type { ModerationContext } from "@/types/supabase";
import type { DashboardStateSetters } from "@/app/dashboard/types";
import { defaultToggles, fallbackKeywords } from "./constants";

const applyFallbacks = (
  data: ModerationContext,
  setters: Pick<DashboardStateSetters, "setKeywords" | "setAdminNumbers">,
) => {
  const nextFallbackKeywords =
    data.defaults?.blockedKeywords && data.defaults.blockedKeywords.length > 0
      ? data.defaults.blockedKeywords
      : fallbackKeywords;
  const nextFallbackAdmins = data.defaults?.adminPhoneNumbers ?? [];
  setters.setKeywords(nextFallbackKeywords);
  setters.setAdminNumbers(nextFallbackAdmins);
};

export const applyContextState = (
  data: ModerationContext,
  setters: DashboardStateSetters,
) => {
  setters.setGroups(data.groups);
  setters.setActiveGroupId(data.activeGroupId);
  setters.setSharedKeywords(data.defaults?.blockedKeywords ?? []);
  setters.setSharedAdminNumbers(data.defaults?.adminPhoneNumbers ?? []);

  if (data.settings) {
    setters.setToggles({
      phoneNumbers: data.settings.blockPhoneNumbers,
      links: data.settings.blockLinks,
      keywords: data.settings.blockKeywords,
      spamProtection: data.settings.spamProtectionEnabled,
    });
    setters.setKeywords(data.settings.blockedKeywords ?? []);
    setters.setAdminNumbers(data.settings.adminPhoneNumbers ?? []);
  } else {
    setters.setToggles(defaultToggles);
    applyFallbacks(data, setters);
  }
};

export const resetOnError = (setters: DashboardStateSetters) => {
  setters.setToggles(defaultToggles);
  setters.setKeywords(fallbackKeywords);
  setters.setAdminNumbers([]);
  setters.setSharedKeywords([]);
  setters.setSharedAdminNumbers([]);
  setters.setGroups([]);
  setters.setActiveGroupId(null);
};
