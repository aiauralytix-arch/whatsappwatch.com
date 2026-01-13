"use client";

import * as React from "react";

import { getModerationSettings } from "@/src/actions/moderation/settings.actions";
import type { ModerationGroup } from "@/types/supabase";
import type {
  DashboardState,
  DashboardStateSetters,
} from "@/app/dashboard/types";
import { defaultToggles, fallbackKeywords } from "@/app/dashboard/utils/constants";
import {
  applyContextState,
  resetOnError,
} from "@/app/dashboard/utils/context";


export const useDashboardState = () => {
  const [toggles, setToggles] = React.useState(defaultToggles);
  const [keywordInput, setKeywordInput] = React.useState("");
  const [keywords, setKeywords] = React.useState<string[]>(fallbackKeywords);
  const [sharedKeywordInput, setSharedKeywordInput] = React.useState("");
  const [sharedKeywords, setSharedKeywords] = React.useState<string[]>([]);
  const [allowlistNumberInput, setAllowlistNumberInput] = React.useState("");
  const [allowlistNumbers, setAllowlistNumbers] = React.useState<string[]>([]);
  const [sharedAllowlistInput, setSharedAllowlistInput] = React.useState("");
  const [sharedAllowlistNumbers, setSharedAllowlistNumbers] = React.useState<
    string[]
  >([]);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [groups, setGroups] = React.useState<ModerationGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = React.useState<string | null>(null);
  const [newGroupLink, setNewGroupLink] = React.useState("");
  const [newGroupName, setNewGroupName] = React.useState("");
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<string[]>([]);

  const setters = React.useMemo<DashboardStateSetters>(
    () => ({
      setToggles,
      setKeywordInput,
      setKeywords,
      setSharedKeywordInput,
      setSharedKeywords,
      setAllowlistNumberInput,
      setAllowlistNumbers,
      setSharedAllowlistInput,
      setSharedAllowlistNumbers,
      setIsSyncing,
      setHasLoaded,
      setGroups,
      setActiveGroupId,
      setNewGroupLink,
      setNewGroupName,
      setSelectedGroupIds,
    }),
    [
      setActiveGroupId,
      setGroups,
      setHasLoaded,
      setIsSyncing,
      setAllowlistNumberInput,
      setAllowlistNumbers,
      setKeywordInput,
      setKeywords,
      setNewGroupLink,
      setNewGroupName,
      setSelectedGroupIds,
      setSharedAllowlistInput,
      setSharedAllowlistNumbers,
      setSharedKeywordInput,
      setSharedKeywords,
      setToggles,
    ],
  );

  const syncGroupSelections = React.useCallback(
    (nextGroups: ModerationGroup[]) => {
      setters.setSelectedGroupIds((prev) =>
        prev.filter((id) => nextGroups.some((group) => group.id === id)),
      );
    },
    [setters],
  );

  const refreshContext = React.useCallback(
    async (groupId?: string) => {
      const data = await getModerationSettings(groupId);
      applyContextState(data, setters);
      syncGroupSelections(data.groups);
      return data;
    },
    [setters, syncGroupSelections],
  );

  React.useEffect(() => {
    let isActive = true;
    setIsSyncing(true);

    void getModerationSettings()
      .then((data) => {
        if (!isActive) return;
        applyContextState(data, setters);
        syncGroupSelections(data.groups);
      })
      .catch(() => {
        if (!isActive) return;
        resetOnError(setters);
      })
      .finally(() => {
        if (!isActive) return;
        setIsSyncing(false);
        setHasLoaded(true);
      });

    return () => {
      isActive = false;
    };
  }, [setters, syncGroupSelections]);

  const canEdit = hasLoaded && Boolean(activeGroupId);
  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? null;

  const state: DashboardState = {
    toggles,
    keywordInput,
    keywords,
    sharedKeywordInput,
    sharedKeywords,
    allowlistNumberInput,
    allowlistNumbers,
    sharedAllowlistInput,
    sharedAllowlistNumbers,
    isSyncing,
    hasLoaded,
    groups,
    activeGroupId,
    newGroupLink,
    newGroupName,
    selectedGroupIds,
  };

  return {
    state: {
      ...state,
    },
    setters,
    canEdit,
    activeGroup,
    refreshContext,
    syncGroupSelections,
  };
};

export type { DashboardState, DashboardStateSetters } from "@/app/dashboard/types";
