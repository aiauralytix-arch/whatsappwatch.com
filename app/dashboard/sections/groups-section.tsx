"use client";

import type { ModerationGroup } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type GroupsSectionProps = {
  newGroupName: string;
  newGroupLink: string;
  onGroupNameChange: (value: string) => void;
  onGroupLinkChange: (value: string) => void;
  onAddGroup: () => void;
  onSelectGroup: (groupId: string) => void;
  onDeleteGroup: () => void;
  hasLoaded: boolean;
  isSyncing: boolean;
  groups: ModerationGroup[];
  activeGroupId: string | null;
  activeGroup: ModerationGroup | null;
};

export default function GroupsSection({
  newGroupName,
  newGroupLink,
  onGroupNameChange,
  onGroupLinkChange,
  onAddGroup,
  onSelectGroup,
  onDeleteGroup,
  hasLoaded,
  isSyncing,
  groups,
  activeGroupId,
  activeGroup,
}: GroupsSectionProps) {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Groups</CardTitle>
          <CardDescription>
            Add up to 50 groups. Select a group to edit its moderation settings.
            Subscription is Rs 299 per group.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Group name (optional)"
              value={newGroupName}
              onChange={(event) => onGroupNameChange(event.target.value)}
              maxLength={80}
              disabled={!hasLoaded || isSyncing}
            />
            <Input
              placeholder="https://chat.whatsapp.com/your-invite-link"
              value={newGroupLink}
              onChange={(event) => onGroupLinkChange(event.target.value)}
              maxLength={512}
              disabled={!hasLoaded || isSyncing}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={onAddGroup}
              disabled={
                !hasLoaded ||
                isSyncing ||
                groups.length >= 50 ||
                newGroupLink.trim().length === 0
              }
            >
              Add Group
            </Button>
          </div>
          <p className="text-sm text-[#6b6b6b]">
            {groups.length}/50 groups added.
          </p>
          <div className="flex flex-wrap gap-2">
            {groups.length === 0 ? (
              <p className="text-sm text-[#6b6b6b]">
                No groups yet. Add a WhatsApp invite link to begin.
              </p>
            ) : (
              groups.map((group) => (
                <Button
                  key={group.id}
                  size="sm"
                  variant={group.id === activeGroupId ? "default" : "outline"}
                  onClick={() => onSelectGroup(group.id)}
                  disabled={isSyncing}
                  title={group.groupName ?? group.groupLink ?? "Untitled group"}
                  className="max-w-[260px] truncate"
                >
                  {group.groupName ?? group.groupLink ?? "Untitled group"}
                </Button>
              ))
            )}
          </div>
          {activeGroup ? (
            <div className="rounded-2xl border border-[#e2dad0] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a948b]">
                Active group
              </p>
              <p className="mt-2 text-sm text-[#161616]">
                {activeGroup.groupName ??
                  activeGroup.groupLink ??
                  "Untitled group"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="soft">Rs {activeGroup.subscriptionPriceInr}</Badge>
                <Badge
                  variant={
                    activeGroup.subscriptionStatus === "active"
                      ? "dark"
                      : "default"
                  }
                >
                  {activeGroup.subscriptionStatus}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-[#6b6b6b]">
                Payments coming soon.
              </p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDeleteGroup}
                  disabled={!activeGroupId || isSyncing}
                  className="border-[#b23a2b] text-[#b23a2b] hover:bg-[#b23a2b] hover:text-[#f6f3ee]"
                >
                  Delete group
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
