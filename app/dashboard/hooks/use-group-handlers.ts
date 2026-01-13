"use client";

import * as React from "react";

import {
  createModerationGroup,
  deleteModerationGroup,
  updateModerationGroupName,
  verifyModerationGroup,
} from "@/src/actions/moderation/groups.actions";
import type { ModerationContext } from "@/types/supabase";
import type { DashboardState, DashboardStateSetters } from "@/app/dashboard/types";

type GroupHandlerParams = {
  state: DashboardState;
  setters: DashboardStateSetters;
  hasLoaded: boolean;
  refreshContext: (groupId?: string) => Promise<ModerationContext>;
  activeGroupId: string | null;
};

export const useGroupHandlers = ({
  state,
  setters,
  hasLoaded,
  refreshContext,
  activeGroupId,
}: GroupHandlerParams) => {
  const handleAddGroup = React.useCallback(() => {
    if (!hasLoaded) return;
    const trimmedLink = state.newGroupLink.trim();
    const trimmedName = state.newGroupName.trim();
    if (!trimmedLink || !trimmedName) return;
    setters.setIsSyncing(true);
    void createModerationGroup(trimmedLink, trimmedName)
      .then((group) => refreshContext(group.id))
      .then(() => {
        setters.setNewGroupLink("");
        setters.setNewGroupName("");
      })
      .finally(() => {
        setters.setIsSyncing(false);
      });
  }, [hasLoaded, refreshContext, setters, state.newGroupLink, state.newGroupName]);

  const handleSelectGroup = React.useCallback(
    (groupId: string) => {
      if (groupId === activeGroupId) return;
      setters.setIsSyncing(true);
      void refreshContext(groupId).finally(() => {
        setters.setIsSyncing(false);
      });
    },
    [activeGroupId, refreshContext, setters],
  );

  const handleDeleteGroup = React.useCallback(() => {
    if (!activeGroupId) return;
    if (!window.confirm("Delete this group and its settings?")) {
      return;
    }
    setters.setIsSyncing(true);
    void deleteModerationGroup(activeGroupId)
      .then(() => refreshContext())
      .finally(() => {
        setters.setIsSyncing(false);
      });
  }, [activeGroupId, refreshContext, setters]);

  const handleRenameGroup = React.useCallback(
    (groupId: string, groupName: string) => {
      const trimmedName = groupName.trim();
      if (!trimmedName) return;
      setters.setIsSyncing(true);
      void updateModerationGroupName(groupId, trimmedName)
        .then((group) => refreshContext(group.id))
        .finally(() => {
          setters.setIsSyncing(false);
        });
    },
    [refreshContext, setters],
  );

  const handleVerifyGroup = React.useCallback(
    (groupId: string, whapiGroupId: string) => {
      setters.setIsSyncing(true);
      return verifyModerationGroup(groupId, whapiGroupId)
        .then((group) => refreshContext(group.id))
        .then(() => undefined)
        .finally(() => {
          setters.setIsSyncing(false);
        });
    },
    [refreshContext, setters],
  );

  return {
    handleAddGroup,
    handleDeleteGroup,
    handleSelectGroup,
    handleRenameGroup,
    handleVerifyGroup,
  };
};
