"use client";

import * as React from "react";

import type { ModerationSettingsInput } from "@/types/supabase";
import { updateModerationSettings } from "@/src/actions/moderation/settings.actions";
import { normalizeAdminNumbersInput, normalizeKeywordsInput } from "@/app/dashboard/utils/normalize";
import type { DashboardState, DashboardStateSetters } from "@/app/dashboard/types";

type SettingsHandlerParams = {
  state: DashboardState;
  setters: DashboardStateSetters;
  canEdit: boolean;
  activeGroupId: string | null;
};

export const useSettingsHandlers = ({
  state,
  setters,
  canEdit,
  activeGroupId,
}: SettingsHandlerParams) => {
  const persistSettings = React.useCallback(
    async (input: ModerationSettingsInput) => {
      if (!activeGroupId) return;
      setters.setIsSyncing(true);
      try {
        await updateModerationSettings(input, { groupId: activeGroupId });
      } finally {
        setters.setIsSyncing(false);
      }
    },
    [activeGroupId, setters],
  );

  const handleToggle = React.useCallback(
    (key: keyof DashboardState["toggles"]) => (value: boolean) => {
      if (!canEdit) return;
      setters.setToggles((prev) => ({ ...prev, [key]: value }));
      const mapKey = {
        phoneNumbers: "blockPhoneNumbers",
        links: "blockLinks",
        keywords: "blockKeywords",
        spamProtection: "spamProtectionEnabled",
      } as const;
      void persistSettings({ [mapKey[key]]: value });
    },
    [canEdit, persistSettings, setters],
  );

  const addKeywords = React.useCallback(() => {
    if (!canEdit) return;
    const next = normalizeKeywordsInput(state.keywordInput);
    if (next.length === 0) return;
    const updated = Array.from(new Set([...state.keywords, ...next]));
    setters.setKeywords(updated);
    setters.setKeywordInput("");
    void persistSettings({ blockedKeywords: updated });
  }, [canEdit, persistSettings, setters, state.keywordInput, state.keywords]);

  const addAdminNumbers = React.useCallback(() => {
    if (!canEdit) return;
    const next = normalizeAdminNumbersInput(state.adminNumberInput.split(","));
    if (next.length === 0) return;
    const updated = Array.from(new Set([...state.adminNumbers, ...next]));
    setters.setAdminNumbers(updated);
    setters.setAdminNumberInput("");
    void persistSettings({ adminPhoneNumbers: updated });
  }, [
    canEdit,
    persistSettings,
    setters,
    state.adminNumberInput,
    state.adminNumbers,
  ]);

  const removeAdminNumber = React.useCallback(
    (number: string) => {
      if (!canEdit) return;
      const updated = state.adminNumbers.filter((entry) => entry !== number);
      setters.setAdminNumbers(updated);
      void persistSettings({ adminPhoneNumbers: updated });
    },
    [canEdit, persistSettings, setters, state.adminNumbers],
  );

  return {
    addAdminNumbers,
    addKeywords,
    handleToggle,
    removeAdminNumber,
  };
};
