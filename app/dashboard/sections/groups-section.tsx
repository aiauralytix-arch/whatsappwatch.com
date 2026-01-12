"use client";

import { useEffect, useState } from "react";

import type { ModerationGroup } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPhoneVerificationStatus } from "@/src/actions/moderation/verification.actions";

const VERIFICATION_ADMIN_NUMBER = "9555488118";
const NAME_MATCH_THRESHOLD = 0.8;

type WhapiGroup = {
  id: string;
  name: string | null;
  description: string | null;
  participants_count: number;
  admin_ids: string[];
};

const normalizePhone = (value: string) => value.replace(/\D/g, "");

const getPhoneMatchKey = (value: string) => {
  const digits = normalizePhone(value);
  return digits.length > 10 ? digits.slice(-10) : digits;
};

const normalizeGroupName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSimilarityScore = (left: string, right: string) => {
  if (!left || !right) return 0;
  if (left === right) return 1;

  const [longer, shorter] =
    left.length >= right.length ? [left, right] : [right, left];

  const previous = Array.from({ length: shorter.length + 1 }, (_, index) => index);

  for (let i = 1; i <= longer.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= shorter.length; j += 1) {
      const cost = longer[i - 1] === shorter[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost,
      );
    }
    for (let j = 0; j < current.length; j += 1) {
      previous[j] = current[j];
    }
  }

  const distance = previous[shorter.length];
  return (longer.length - distance) / longer.length;
};

type GroupsSectionProps = {
  newGroupName: string;
  newGroupLink: string;
  onGroupNameChange: (value: string) => void;
  onGroupLinkChange: (value: string) => void;
  onAddGroup: () => void;
  onSelectGroup: (groupId: string) => void;
  onDeleteGroup: () => void;
  onRenameGroup: (groupId: string, groupName: string) => void;
  onVerifyGroup: (groupId: string, whapiGroupId: string) => Promise<void>;
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
  onRenameGroup,
  onVerifyGroup,
  hasLoaded,
  isSyncing,
  groups,
  activeGroupId,
  activeGroup,
}: GroupsSectionProps) {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationNote, setVerificationNote] = useState<string | null>(null);
  const [candidateGroups, setCandidateGroups] = useState<WhapiGroup[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [verificationTarget, setVerificationTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [groupNameInput, setGroupNameInput] = useState("");

  useEffect(() => {
    if (!activeGroup) {
      setGroupNameInput("");
      return;
    }

    setGroupNameInput(activeGroup.groupName ?? "");
  }, [activeGroup]);

  const isActiveVerified = activeGroup?.isVerified ?? false;

  const openVerification = () => {
    if (!activeGroupId || !activeGroup) return;
    setVerificationTarget({
      id: activeGroupId,
      name: activeGroup.groupName ?? "",
    });
    setVerificationError(null);
    setVerificationNote(null);
    setCandidateGroups([]);
    setSelectedCandidateId(null);
    setIsVerificationOpen(true);
  };

  const closeVerification = () => {
    setIsVerificationOpen(false);
    setIsChecking(false);
    setCandidateGroups([]);
    setSelectedCandidateId(null);
    setVerificationError(null);
    setVerificationNote(null);
  };

  const handleCheckVerification = async () => {
    if (!verificationTarget) return;

    setIsChecking(true);
    setVerificationError(null);
    setVerificationNote(null);
    setCandidateGroups([]);
    setSelectedCandidateId(null);

    try {
      const targetName = normalizeGroupName(verificationTarget.name);
      if (!targetName) {
        throw new Error("Add a group name before verifying.");
      }

      const phoneStatus = await getPhoneVerificationStatus();
      if (!phoneStatus.phoneNumber || !phoneStatus.verifiedAt) {
        throw new Error("Verify your phone number before checking a group.");
      }

      const userPhone = getPhoneMatchKey(phoneStatus.phoneNumber);
      if (!userPhone) {
        throw new Error("Verified phone number is invalid.");
      }

      const response = await fetch("/api/whapi/groups", { cache: "no-store" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch groups.${errorText ? ` Details: ${errorText}` : ""}`,
        );
      }

      const payload = (await response.json()) as { groups?: unknown };
      const rawGroups = Array.isArray(payload.groups) ? payload.groups : [];
      const helperNumber = getPhoneMatchKey(VERIFICATION_ADMIN_NUMBER);

      const matches = rawGroups
        .map((group) => {
          const candidate = group as Partial<WhapiGroup>;
          if (!candidate.id) return null;

          const adminIds = Array.isArray(candidate.admin_ids)
            ? candidate.admin_ids
            : [];
          const normalizedAdmins = adminIds
            .map((id) => getPhoneMatchKey(id))
            .filter(Boolean);

          const similarity = getSimilarityScore(
            targetName,
            normalizeGroupName(candidate.name ?? ""),
          );

          const hasUserAdmin = normalizedAdmins.includes(userPhone);
          const hasHelperAdmin = normalizedAdmins.includes(helperNumber);

          return {
            group: candidate as WhapiGroup,
            similarity,
            hasUserAdmin,
            hasHelperAdmin,
          };
        })
        .filter(
          (entry): entry is NonNullable<typeof entry> =>
            entry !== null &&
            entry.hasUserAdmin &&
            entry.hasHelperAdmin &&
            entry.similarity >= NAME_MATCH_THRESHOLD,
        )
        .map((entry) => entry.group);

      if (matches.length === 0) {
        throw new Error(
          "No matching group found. Confirm the group name and that your verified number plus 9555488118 are admins.",
        );
      }

      if (matches.length === 1) {
        await onVerifyGroup(verificationTarget.id, matches[0].id);
        setVerificationNote(
          `Verified ${matches[0].name ?? "group"} successfully.`,
        );
        return;
      }

      setCandidateGroups(matches);
      setVerificationNote(
        "Multiple groups matched. Select the correct one to verify.",
      );
    } catch (err) {
      setVerificationError(
        err instanceof Error ? err.message : "Verification failed.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirmCandidate = async () => {
    if (!verificationTarget) return;
    if (!selectedCandidateId) {
      setVerificationError("Select a group to verify.");
      return;
    }

    const selected = candidateGroups.find(
      (group) => group.id === selectedCandidateId,
    );

    try {
      setVerificationError(null);
      await onVerifyGroup(verificationTarget.id, selectedCandidateId);
      setVerificationNote(
        `Verified ${selected?.name ?? "group"} successfully.`,
      );
      setCandidateGroups([]);
      setSelectedCandidateId(null);
    } catch (err) {
      setVerificationError(
        err instanceof Error ? err.message : "Verification failed.",
      );
    }
  };

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
                <Badge variant={isActiveVerified ? "dark" : "soft"}>
                  {isActiveVerified ? "verified" : "not verified"}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-[#6b6b6b]">
                Payments coming soon.
              </p>
              <div className="mt-4 space-y-3">
                <Input
                  placeholder="Update group name"
                  value={groupNameInput}
                  onChange={(event) => setGroupNameInput(event.target.value)}
                  maxLength={80}
                  disabled={!activeGroupId || isSyncing}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!activeGroupId) return;
                    onRenameGroup(activeGroupId, groupNameInput);
                  }}
                  disabled={
                    !activeGroupId ||
                    isSyncing ||
                    groupNameInput.trim() ===
                      (activeGroup.groupName ?? "").trim()
                  }
                >
                  Save group name
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openVerification}
                  disabled={!activeGroupId || isSyncing}
                >
                  Verify group
                </Button>
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
      {isVerificationOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-3xl bg-[#fefcf9] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#161616]">
                  Verify group
                </h3>
                <p className="mt-1 text-sm text-[#6b6b6b]">
                  Verify “{verificationTarget?.name || "Untitled group"}” before
                  running moderation.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={closeVerification}
                disabled={isChecking}
              >
                Close
              </Button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-[#6b6b6b]">
              <p>
                Make sure your verified number (used for OTP) is an admin in the
                group.
              </p>
              <p>
                1. Add <span className="font-semibold text-[#161616]">9555488118</span>{" "}
                to the WhatsApp group.
              </p>
              <p>2. Make that number an admin in the group.</p>
              <p>
                3. Click verify to check that both admins are present and the
                name matches.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={handleCheckVerification} disabled={isChecking}>
                {isChecking ? "Checking..." : "Verify now"}
              </Button>
            </div>

            {candidateGroups.length > 0 ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm text-[#6b6b6b]">
                  Multiple groups matched. Choose one to verify:
                </p>
                <div className="space-y-2">
                  {candidateGroups.map((group) => (
                    <label
                      key={group.id}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#e2dad0] bg-white px-4 py-3 text-left"
                    >
                      <input
                        type="radio"
                        name="whapi-group"
                        value={group.id}
                        checked={selectedCandidateId === group.id}
                        onChange={() => setSelectedCandidateId(group.id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-sm font-medium text-[#161616]">
                          {group.name ?? group.id}
                        </span>
                        <span className="block text-xs text-[#6b6b6b]">
                          {group.participants_count} participants
                        </span>
                        {group.description ? (
                          <span className="mt-1 block text-xs text-[#9a948b]">
                            {group.description}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  ))}
                </div>
                <Button onClick={handleConfirmCandidate} disabled={isChecking}>
                  Confirm selection
                </Button>
              </div>
            ) : null}

            {verificationNote ? (
              <p className="mt-4 text-sm text-[#1b6f5f]">
                {verificationNote}
              </p>
            ) : null}
            {verificationError ? (
              <p className="mt-3 text-sm text-[#b23a2b]">
                {verificationError}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
