"use client";

import type { ModerationGroup } from "@/types/supabase";
import { Button } from "@/components/ui/button";

type SharedDefaultsGroupsProps = {
  groups: ModerationGroup[];
  selectedGroupIds: string[];
  isSyncing: boolean;
  sharedAdminCount: number;
  sharedKeywordCount: number;
  onToggleGroupSelection: (groupId: string) => void;
  onSelectAllGroups: () => void;
  onClearSelectedGroups: () => void;
  onApplyDefaults: () => void;
};

export default function SharedDefaultsGroups({
  groups,
  selectedGroupIds,
  isSyncing,
  sharedAdminCount,
  sharedKeywordCount,
  onToggleGroupSelection,
  onSelectAllGroups,
  onClearSelectedGroups,
  onApplyDefaults,
}: SharedDefaultsGroupsProps) {
  return (
    <div className="rounded-2xl border border-[#e2dad0] bg-white p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[#9a948b]">
        Apply defaults to existing groups
      </p>
      <p className="mt-2 text-sm text-[#6b6b6b]">
        Select groups below. Defaults are merged with each group and do not
        change toggle settings.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {groups.length === 0 ? (
          <p className="text-sm text-[#6b6b6b]">
            Add a group to enable bulk updates.
          </p>
        ) : (
          groups.map((group) => {
            const isSelected = selectedGroupIds.includes(group.id);
            return (
              <Button
                key={group.id}
                size="sm"
                variant={isSelected ? "default" : "outline"}
                onClick={() => onToggleGroupSelection(group.id)}
                disabled={isSyncing}
                title={group.groupName ?? group.groupLink ?? "Untitled group"}
                className="max-w-[260px] truncate"
              >
                {group.groupName ?? group.groupLink ?? "Untitled group"}
              </Button>
            );
          })
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={onSelectAllGroups}
          disabled={groups.length === 0 || isSyncing}
        >
          Select all
        </Button>
        <Button
          variant="outline"
          onClick={onClearSelectedGroups}
          disabled={selectedGroupIds.length === 0 || isSyncing}
        >
          Clear selection
        </Button>
        <Button
          onClick={onApplyDefaults}
          disabled={
            selectedGroupIds.length === 0 ||
            isSyncing ||
            sharedAdminCount + sharedKeywordCount === 0
          }
        >
          Apply defaults to {selectedGroupIds.length} group
          {selectedGroupIds.length === 1 ? "" : "s"}
        </Button>
      </div>
    </div>
  );
}
