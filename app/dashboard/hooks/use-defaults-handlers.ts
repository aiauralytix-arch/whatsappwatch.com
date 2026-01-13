"use client";

import * as React from "react";

import {
  applyModerationDefaultsToGroups,
  updateModerationDefaults,
} from "@/src/actions/moderation/defaults.actions";
import { normalizeAllowlistNumbersInput, normalizeKeywordsInput } from "@/app/dashboard/utils/normalize";
import type { DashboardState, DashboardStateSetters } from "@/app/dashboard/types";
import type { ModerationContext } from "@/types/supabase";

type DefaultsHandlerParams = {
  state: DashboardState;
  setters: DashboardStateSetters;
  hasLoaded: boolean;
  refreshContext: (groupId?: string) => Promise<ModerationContext>;
  activeGroupId: string | null;
};

export const useDefaultsHandlers = ({
  state,
  setters,
  hasLoaded,
  refreshContext,
  activeGroupId,
}: DefaultsHandlerParams) => {
  const persistDefaults = React.useCallback(
    async (input: {
      blockedKeywords?: string[];
      allowlistPhoneNumbers?: string[];
    }) => {
      if (!hasLoaded) return;
      setters.setIsSyncing(true);
      try {
        const updated = await updateModerationDefaults(input);
        setters.setSharedKeywords(updated.blockedKeywords ?? []);
        setters.setSharedAllowlistNumbers(updated.allowlistPhoneNumbers ?? []);
      } finally {
        setters.setIsSyncing(false);
      }
    },
    [hasLoaded, setters],
  );

  const addSharedKeywords = React.useCallback(() => {
    if (!hasLoaded) return;
    const next = normalizeKeywordsInput(state.sharedKeywordInput);
    if (next.length === 0) return;
    const updated = Array.from(new Set([...state.sharedKeywords, ...next]));
    setters.setSharedKeywords(updated);
    setters.setSharedKeywordInput("");
    void persistDefaults({ blockedKeywords: updated });
  }, [hasLoaded, persistDefaults, setters, state.sharedKeywordInput, state.sharedKeywords]);

  const removeSharedKeyword = React.useCallback(
    (keyword: string) => {
      if (!hasLoaded) return;
      const updated = state.sharedKeywords.filter((entry) => entry !== keyword);
      setters.setSharedKeywords(updated);
      void persistDefaults({ blockedKeywords: updated });
    },
    [hasLoaded, persistDefaults, setters, state.sharedKeywords],
  );

  const addSharedAllowlistNumbers = React.useCallback(() => {
    if (!hasLoaded) return;
    const next = normalizeAllowlistNumbersInput(
      state.sharedAllowlistInput.split(","),
    );
    if (next.length === 0) return;
    const updated = Array.from(
      new Set([...state.sharedAllowlistNumbers, ...next]),
    );
    setters.setSharedAllowlistNumbers(updated);
    setters.setSharedAllowlistInput("");
    void persistDefaults({ allowlistPhoneNumbers: updated });
  }, [
    hasLoaded,
    persistDefaults,
    setters,
    state.sharedAllowlistInput,
    state.sharedAllowlistNumbers,
  ]);

  const removeSharedAllowlistNumber = React.useCallback(
    (number: string) => {
      if (!hasLoaded) return;
      const updated = state.sharedAllowlistNumbers.filter(
        (entry) => entry !== number,
      );
      setters.setSharedAllowlistNumbers(updated);
      void persistDefaults({ allowlistPhoneNumbers: updated });
    },
    [hasLoaded, persistDefaults, setters, state.sharedAllowlistNumbers],
  );

  const toggleGroupSelection = React.useCallback(
    (groupId: string) => {
      setters.setSelectedGroupIds((prev) =>
        prev.includes(groupId)
          ? prev.filter((id) => id !== groupId)
          : [...prev, groupId],
      );
    },
    [setters],
  );

  const selectAllGroups = React.useCallback(() => {
    setters.setSelectedGroupIds(state.groups.map((group) => group.id));
  }, [setters, state.groups]);

  const clearSelectedGroups = React.useCallback(() => {
    setters.setSelectedGroupIds([]);
  }, [setters]);

  const applyDefaultsToSelectedGroups = React.useCallback(() => {
    if (!hasLoaded || state.selectedGroupIds.length === 0) return;
    setters.setIsSyncing(true);
    void applyModerationDefaultsToGroups(state.selectedGroupIds)
      .then(() => refreshContext(activeGroupId ?? undefined))
      .finally(() => {
        setters.setIsSyncing(false);
      });
  }, [
    activeGroupId,
    hasLoaded,
    refreshContext,
    setters,
    state.selectedGroupIds,
  ]);

  return {
    addSharedAllowlistNumbers,
    addSharedKeywords,
    applyDefaultsToSelectedGroups,
    clearSelectedGroups,
    removeSharedAllowlistNumber,
    removeSharedKeyword,
    selectAllGroups,
    toggleGroupSelection,
  };
};
