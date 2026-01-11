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
  const [adminNumberInput, setAdminNumberInput] = React.useState("");
  const [adminNumbers, setAdminNumbers] = React.useState<string[]>([]);
  const [sharedAdminInput, setSharedAdminInput] = React.useState("");
  const [sharedAdminNumbers, setSharedAdminNumbers] = React.useState<string[]>(
    [],
  );
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
      setAdminNumberInput,
      setAdminNumbers,
      setSharedAdminInput,
      setSharedAdminNumbers,
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
      setAdminNumberInput,
      setAdminNumbers,
      setGroups,
      setHasLoaded,
      setIsSyncing,
      setKeywordInput,
      setKeywords,
      setNewGroupLink,
      setNewGroupName,
      setSelectedGroupIds,
      setSharedAdminInput,
      setSharedAdminNumbers,
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
    adminNumberInput,
    adminNumbers,
    sharedAdminInput,
    sharedAdminNumbers,
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
