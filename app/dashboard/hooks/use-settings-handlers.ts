"use client";

import * as React from "react";

import type { ModerationSettingsInput } from "@/types/supabase";
import { updateModerationSettings } from "@/src/actions/moderation/settings.actions";
import { normalizeAllowlistNumbersInput, normalizeKeywordsInput } from "@/app/dashboard/utils/normalize";
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
        groupInvites: "blockGroupInvites",
        contacts: "blockContacts",
        videos: "blockVideos",
        images: "blockImages",
        keywords: "blockKeywords",
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

  const removeKeyword = React.useCallback(
    (keyword: string) => {
      if (!canEdit) return;
      const updated = state.keywords.filter((entry) => entry !== keyword);
      setters.setKeywords(updated);
      void persistSettings({ blockedKeywords: updated });
    },
    [canEdit, persistSettings, setters, state.keywords],
  );

  const addAllowlistNumbers = React.useCallback(() => {
    if (!canEdit) return;
    const next = normalizeAllowlistNumbersInput(
      state.allowlistNumberInput.split(","),
    );
    if (next.length === 0) return;
    const updated = Array.from(new Set([...state.allowlistNumbers, ...next]));
    setters.setAllowlistNumbers(updated);
    setters.setAllowlistNumberInput("");
    void persistSettings({ allowlistPhoneNumbers: updated });
  }, [
    canEdit,
    persistSettings,
    setters,
    state.allowlistNumberInput,
    state.allowlistNumbers,
  ]);

  const removeAllowlistNumber = React.useCallback(
    (number: string) => {
      if (!canEdit) return;
      const updated = state.allowlistNumbers.filter((entry) => entry !== number);
      setters.setAllowlistNumbers(updated);
      void persistSettings({ allowlistPhoneNumbers: updated });
    },
    [canEdit, persistSettings, setters, state.allowlistNumbers],
  );

  return {
    addAllowlistNumbers,
    addKeywords,
    handleToggle,
    removeAllowlistNumber,
    removeKeyword,
  };
};
