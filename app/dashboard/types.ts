import type * as React from "react";
import type { ModerationGroup } from "@/types/supabase";

export type ToggleState = {
  phoneNumbers: boolean;
  links: boolean;
  groupInvites: boolean;
  contacts: boolean;
  keywords: boolean;
};

export type DashboardState = {
  toggles: ToggleState;
  keywordInput: string;
  keywords: string[];
  sharedKeywordInput: string;
  sharedKeywords: string[];
  allowlistNumberInput: string;
  allowlistNumbers: string[];
  sharedAllowlistInput: string;
  sharedAllowlistNumbers: string[];
  isSyncing: boolean;
  hasLoaded: boolean;
  groups: ModerationGroup[];
  activeGroupId: string | null;
  newGroupLink: string;
  newGroupName: string;
  selectedGroupIds: string[];
};

export type DashboardStateSetters = {
  setToggles: React.Dispatch<React.SetStateAction<ToggleState>>;
  setKeywordInput: React.Dispatch<React.SetStateAction<string>>;
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  setSharedKeywordInput: React.Dispatch<React.SetStateAction<string>>;
  setSharedKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  setAllowlistNumberInput: React.Dispatch<React.SetStateAction<string>>;
  setAllowlistNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  setSharedAllowlistInput: React.Dispatch<React.SetStateAction<string>>;
  setSharedAllowlistNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  setIsSyncing: React.Dispatch<React.SetStateAction<boolean>>;
  setHasLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setGroups: React.Dispatch<React.SetStateAction<ModerationGroup[]>>;
  setActiveGroupId: React.Dispatch<React.SetStateAction<string | null>>;
  setNewGroupLink: React.Dispatch<React.SetStateAction<string>>;
  setNewGroupName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedGroupIds: React.Dispatch<React.SetStateAction<string[]>>;
};
