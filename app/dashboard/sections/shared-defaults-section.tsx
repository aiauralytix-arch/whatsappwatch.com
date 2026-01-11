"use client";

import type { ModerationGroup } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SharedDefaultsGroups from "./shared-defaults-groups";

type SharedDefaultsSectionProps = {
  hasLoaded: boolean;
  isSyncing: boolean;
  groups: ModerationGroup[];
  selectedGroupIds: string[];
  sharedAdminInput: string;
  sharedAdminNumbers: string[];
  sharedKeywordInput: string;
  sharedKeywords: string[];
  onSharedAdminInputChange: (value: string) => void;
  onSharedKeywordInputChange: (value: string) => void;
  onAddSharedAdmins: () => void;
  onAddSharedKeywords: () => void;
  onRemoveSharedAdmin: (number: string) => void;
  onRemoveSharedKeyword: (keyword: string) => void;
  onToggleGroupSelection: (groupId: string) => void;
  onSelectAllGroups: () => void;
  onClearSelectedGroups: () => void;
  onApplyDefaults: () => void;
};

export default function SharedDefaultsSection({
  hasLoaded,
  isSyncing,
  groups,
  selectedGroupIds,
  sharedAdminInput,
  sharedAdminNumbers,
  sharedKeywordInput,
  sharedKeywords,
  onSharedAdminInputChange,
  onSharedKeywordInputChange,
  onAddSharedAdmins,
  onAddSharedKeywords,
  onRemoveSharedAdmin,
  onRemoveSharedKeyword,
  onToggleGroupSelection,
  onSelectAllGroups,
  onClearSelectedGroups,
  onApplyDefaults,
}: SharedDefaultsSectionProps) {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Shared Defaults</CardTitle>
          <CardDescription>
            Maintain shared admin numbers and keywords for new groups, then
            apply them to existing groups in bulk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Label className="text-base">Default admin allowlist</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Add default admin numbers (comma separated)"
                  value={sharedAdminInput}
                  onChange={(event) => onSharedAdminInputChange(event.target.value)}
                  disabled={!hasLoaded || isSyncing}
                />
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={onAddSharedAdmins}
                  disabled={!hasLoaded || isSyncing}
                >
                  Save Admins
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sharedAdminNumbers.length === 0 ? (
                  <p className="text-sm text-[#6b6b6b]">
                    No default admin numbers yet.
                  </p>
                ) : (
                  sharedAdminNumbers.map((number) => (
                    <Badge key={number} variant="soft" className="gap-2 pr-1">
                      <span>{number}</span>
                      <button
                        type="button"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#fefcf9] text-[10px] font-medium leading-none text-[#6b6b6b] ring-1 ring-[#d5cec3] transition hover:bg-[#161616] hover:text-[#f6f3ee] normal-case tracking-normal"
                        onClick={() => onRemoveSharedAdmin(number)}
                        aria-label="Remove default admin number"
                        disabled={isSyncing}
                      >
                        x
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-base">Default keyword blocklist</Label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Add default keywords (comma separated)"
                  value={sharedKeywordInput}
                  onChange={(event) => onSharedKeywordInputChange(event.target.value)}
                  disabled={!hasLoaded || isSyncing}
                />
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={onAddSharedKeywords}
                  disabled={!hasLoaded || isSyncing}
                >
                  Save Keywords
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sharedKeywords.length === 0 ? (
                  <p className="text-sm text-[#6b6b6b]">
                    No default keywords yet.
                  </p>
                ) : (
                  sharedKeywords.map((keyword) => (
                    <Badge key={keyword} variant="soft" className="gap-2 pr-1">
                      <span>{keyword}</span>
                      <button
                        type="button"
                        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#fefcf9] text-[10px] font-medium leading-none text-[#6b6b6b] ring-1 ring-[#d5cec3] transition hover:bg-[#161616] hover:text-[#f6f3ee] normal-case tracking-normal"
                        onClick={() => onRemoveSharedKeyword(keyword)}
                        aria-label="Remove default keyword"
                        disabled={isSyncing}
                      >
                        x
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
          <SharedDefaultsGroups
            groups={groups}
            selectedGroupIds={selectedGroupIds}
            isSyncing={isSyncing}
            sharedAdminCount={sharedAdminNumbers.length}
            sharedKeywordCount={sharedKeywords.length}
            onToggleGroupSelection={onToggleGroupSelection}
            onSelectAllGroups={onSelectAllGroups}
            onClearSelectedGroups={onClearSelectedGroups}
            onApplyDefaults={onApplyDefaults}
          />
        </CardContent>
      </Card>
    </section>
  );
}
