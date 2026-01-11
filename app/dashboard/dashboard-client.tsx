"use client";

import HeaderSection from "@/app/dashboard/sections/header-section";
import SetupSection from "@/app/dashboard/sections/setup-section";
import PhoneVerificationSection from "@/app/dashboard/sections/phone-verification-section";
import TutorialSection from "@/app/dashboard/sections/tutorial-section";
import GroupsSection from "@/app/dashboard/sections/groups-section";
import SharedDefaultsSection from "@/app/dashboard/sections/shared-defaults-section";
import ModerationTogglesSection from "@/app/dashboard/sections/moderation-toggles-section";
import AdminAllowlistSection from "@/app/dashboard/sections/admin-allowlist-section";
import KeywordSection from "@/app/dashboard/sections/keyword-section";
import AnalyticsSection from "@/app/dashboard/sections/analytics-section";
import FooterSection from "@/app/dashboard/sections/footer-section";
import { useDashboardState } from "@/app/dashboard/hooks/use-dashboard-state";
import { useGroupHandlers } from "@/app/dashboard/hooks/use-group-handlers";
import { useSettingsHandlers } from "@/app/dashboard/hooks/use-settings-handlers";
import { useDefaultsHandlers } from "@/app/dashboard/hooks/use-defaults-handlers";

type DashboardClientProps = {
  userName: string;
  userEmail: string;
};

export default function DashboardClient({ userName, userEmail }: DashboardClientProps) {
  const { state, setters, canEdit, activeGroup, refreshContext } =
    useDashboardState();

  const groupHandlers = useGroupHandlers({
    state,
    setters,
    hasLoaded: state.hasLoaded,
    refreshContext,
    activeGroupId: state.activeGroupId,
  });

  const settingsHandlers = useSettingsHandlers({
    state,
    setters,
    canEdit,
    activeGroupId: state.activeGroupId,
  });

  const defaultsHandlers = useDefaultsHandlers({
    state,
    setters,
    hasLoaded: state.hasLoaded,
    refreshContext,
    activeGroupId: state.activeGroupId,
  });

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#161616]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#f7b787] opacity-40 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[#8cc7c0] opacity-40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(90deg,transparent_0px,transparent_34px,rgba(0,0,0,0.05)_35px)] opacity-20" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <HeaderSection userName={userName} userEmail={userEmail} />
        <SetupSection />
        <PhoneVerificationSection />
        <TutorialSection />
        <GroupsSection
          newGroupName={state.newGroupName}
          newGroupLink={state.newGroupLink}
          onGroupNameChange={setters.setNewGroupName}
          onGroupLinkChange={setters.setNewGroupLink}
          onAddGroup={groupHandlers.handleAddGroup}
          onSelectGroup={groupHandlers.handleSelectGroup}
          onDeleteGroup={groupHandlers.handleDeleteGroup}
          hasLoaded={state.hasLoaded}
          isSyncing={state.isSyncing}
          groups={state.groups}
          activeGroupId={state.activeGroupId}
          activeGroup={activeGroup}
        />
        {state.hasLoaded && state.groups.length > 1 ? (
          <SharedDefaultsSection
            hasLoaded={state.hasLoaded}
            isSyncing={state.isSyncing}
            groups={state.groups}
            selectedGroupIds={state.selectedGroupIds}
            sharedAdminInput={state.sharedAdminInput}
            sharedAdminNumbers={state.sharedAdminNumbers}
            sharedKeywordInput={state.sharedKeywordInput}
            sharedKeywords={state.sharedKeywords}
            onSharedAdminInputChange={setters.setSharedAdminInput}
            onSharedKeywordInputChange={setters.setSharedKeywordInput}
            onAddSharedAdmins={defaultsHandlers.addSharedAdminNumbers}
            onAddSharedKeywords={defaultsHandlers.addSharedKeywords}
            onRemoveSharedAdmin={defaultsHandlers.removeSharedAdminNumber}
            onRemoveSharedKeyword={defaultsHandlers.removeSharedKeyword}
            onToggleGroupSelection={defaultsHandlers.toggleGroupSelection}
            onSelectAllGroups={defaultsHandlers.selectAllGroups}
            onClearSelectedGroups={defaultsHandlers.clearSelectedGroups}
            onApplyDefaults={defaultsHandlers.applyDefaultsToSelectedGroups}
          />
        ) : null}
        <ModerationTogglesSection
          toggles={state.toggles}
          canEdit={canEdit}
          isSyncing={state.isSyncing}
          onToggle={settingsHandlers.handleToggle}
        />
        <AdminAllowlistSection
          adminNumberInput={state.adminNumberInput}
          adminNumbers={state.adminNumbers}
          canEdit={canEdit}
          isSyncing={state.isSyncing}
          onAdminInputChange={setters.setAdminNumberInput}
          onAddAdminNumbers={settingsHandlers.addAdminNumbers}
          onRemoveAdminNumber={settingsHandlers.removeAdminNumber}
        />
        <KeywordSection
          keywordInput={state.keywordInput}
          keywords={state.keywords}
          canEdit={canEdit}
          isSyncing={state.isSyncing}
          onKeywordInputChange={setters.setKeywordInput}
          onAddKeywords={settingsHandlers.addKeywords}
        />
        <AnalyticsSection />
        <FooterSection isSyncing={state.isSyncing} />
      </main>
    </div>
  );
}
