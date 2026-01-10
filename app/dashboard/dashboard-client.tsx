"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  createModerationGroup,
  getModerationSettings,
  updateModerationSettings,
} from "./actions";
import type {
  ModerationGroup,
  ModerationSettingsInput,
} from "@/types/supabase";

type DashboardClientProps = {
  userName: string;
  userEmail: string;
};

const defaultKeywords = ["giveaway", "promo", "loan"];
const defaultToggles = {
  phoneNumbers: true,
  links: true,
  keywords: true,
  spamProtection: false,
};

export default function DashboardClient({
  userName,
  userEmail,
}: DashboardClientProps) {
  const [toggles, setToggles] = React.useState(defaultToggles);
  const [keywordInput, setKeywordInput] = React.useState("");
  const [keywords, setKeywords] = React.useState<string[]>(defaultKeywords);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [groups, setGroups] = React.useState<ModerationGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = React.useState<string | null>(null);
  const [newGroupLink, setNewGroupLink] = React.useState("");
  const canEdit = hasLoaded && Boolean(activeGroupId);

  React.useEffect(() => {
    let isActive = true;

    const loadSettings = async () => {
      setIsSyncing(true);
      try {
        const data = await getModerationSettings();

        if (isActive) {
          setGroups(data.groups);
          setActiveGroupId(data.activeGroupId);
          if (data.settings) {
            setToggles({
              phoneNumbers: data.settings.blockPhoneNumbers,
              links: data.settings.blockLinks,
              keywords: data.settings.blockKeywords,
              spamProtection: data.settings.spamProtectionEnabled,
            });
            setKeywords(
              data.settings.blockedKeywords.length > 0
                ? data.settings.blockedKeywords
                : defaultKeywords,
            );
          } else {
            setToggles(defaultToggles);
            setKeywords(defaultKeywords);
          }
        }
      } catch {
        if (isActive) {
          setToggles(defaultToggles);
          setKeywords(defaultKeywords);
          setGroups([]);
          setActiveGroupId(null);
        }
      } finally {
        if (isActive) {
          setIsSyncing(false);
          setHasLoaded(true);
        }
      }
    };

    void loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  const persistSettings = React.useCallback(
    async (input: ModerationSettingsInput) => {
      if (!activeGroupId) return;
      setIsSyncing(true);
      try {
        await updateModerationSettings(input, { groupId: activeGroupId });
      } finally {
        setIsSyncing(false);
      }
    },
    [activeGroupId],
  );

  const handleToggle = (key: keyof typeof toggles) => (value: boolean) => {
    if (!canEdit) return;
    setToggles((prev) => ({ ...prev, [key]: value }));
    const mapKey = {
      phoneNumbers: "blockPhoneNumbers",
      links: "blockLinks",
      keywords: "blockKeywords",
      spamProtection: "spamProtectionEnabled",
    } as const;
    void persistSettings({ [mapKey[key]]: value });
  };

  const addKeywords = () => {
    if (!canEdit) return;
    const next = keywordInput
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (next.length === 0) return;

    const updated = Array.from(new Set([...keywords, ...next]));
    setKeywords(updated);
    setKeywordInput("");
    void persistSettings({ blockedKeywords: updated });
  };

  const handleAddGroup = () => {
    if (!hasLoaded) return;
    const trimmed = newGroupLink.trim();
    if (!trimmed) return;
    setIsSyncing(true);
    void createModerationGroup(trimmed)
      .then((group) => getModerationSettings(group.id))
      .then((data) => {
        setGroups(data.groups);
        setActiveGroupId(data.activeGroupId);
        setNewGroupLink("");
        if (data.settings) {
          setToggles({
            phoneNumbers: data.settings.blockPhoneNumbers,
            links: data.settings.blockLinks,
            keywords: data.settings.blockKeywords,
            spamProtection: data.settings.spamProtectionEnabled,
          });
          setKeywords(
            data.settings.blockedKeywords.length > 0
              ? data.settings.blockedKeywords
              : defaultKeywords,
          );
        } else {
          setToggles(defaultToggles);
          setKeywords(defaultKeywords);
        }
      })
      .finally(() => {
        setIsSyncing(false);
      });
  };

  const handleSelectGroup = (groupId: string) => {
    if (groupId === activeGroupId) return;
    setIsSyncing(true);
    void getModerationSettings(groupId)
      .then((data) => {
        setGroups(data.groups);
        setActiveGroupId(data.activeGroupId);
        if (data.settings) {
          setToggles({
            phoneNumbers: data.settings.blockPhoneNumbers,
            links: data.settings.blockLinks,
            keywords: data.settings.blockKeywords,
            spamProtection: data.settings.spamProtectionEnabled,
          });
          setKeywords(
            data.settings.blockedKeywords.length > 0
              ? data.settings.blockedKeywords
              : defaultKeywords,
          );
        } else {
          setToggles(defaultToggles);
          setKeywords(defaultKeywords);
        }
      })
      .finally(() => {
        setIsSyncing(false);
      });
  };

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#161616]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-[#f7b787] opacity-40 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[#8cc7c0] opacity-40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(90deg,transparent_0px,transparent_34px,rgba(0,0,0,0.05)_35px)] opacity-20" />
      </div>

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-16 sm:px-10 lg:px-16">
        <section className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
                Admin Control Panel
              </p>
              <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
                WhatsApp Moderation Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#4b4b4b]">
                Control how messages are moderated across your WhatsApp groups.
              </p>
            </div>
            <Card className="w-full max-w-sm bg-[#fefcf9] p-6 sm:w-auto">
              <CardHeader className="pb-4">
                <CardDescription>Signed in as</CardDescription>
                <CardTitle className="text-lg">{userName}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[#6b6b6b]">{userEmail}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card className="bg-[#fefcf9]">
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                Follow this guided flow to activate moderation in minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4 text-sm text-[#4b4b4b]">
                  <div className="flex gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a948b]">
                      Step 1
                    </span>
                    <span>Add your WhatsApp group invite link.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a948b]">
                      Step 2
                    </span>
                    <span>Select the group you want to moderate.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a948b]">
                      Step 3
                    </span>
                    <span>Enable moderation toggles below.</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e2dad0] bg-white p-5 text-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9a948b]">
                    Sample details
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#161616]">
                    +1 (415) 555-0123
                  </p>
                  <p className="mt-2 text-[#4b4b4b]">
                    Group: <span className="font-medium">Community Alpha</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-[#fefcf9]">
            <CardHeader>
              <CardTitle>
                Watch: How to set up WhatsApp moderation in 2 minutes
              </CardTitle>
              <CardDescription>
                A short walkthrough to get your group protected quickly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-3xl border border-[#e2dad0] bg-[#efe9df]">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/ysz5S6PUM-U"
                  title="WhatsApp moderation tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-[#fefcf9]">
            <CardHeader>
              <CardTitle>Groups</CardTitle>
              <CardDescription>
                Add up to 50 groups. Select a group to edit its moderation
                settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="https://chat.whatsapp.com/your-invite-link"
                  value={newGroupLink}
                  onChange={(event) => setNewGroupLink(event.target.value)}
                  disabled={!hasLoaded || isSyncing}
                />
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={handleAddGroup}
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
                      variant={
                        group.id === activeGroupId ? "default" : "outline"
                      }
                      onClick={() => handleSelectGroup(group.id)}
                      disabled={isSyncing}
                      title={group.groupLink ?? "Untitled group"}
                      className="max-w-[260px] truncate"
                    >
                      {group.groupLink ?? "Untitled group"}
                    </Button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-[#fefcf9]">
            <CardHeader>
              <CardTitle>Moderation Toggles</CardTitle>
              <CardDescription>
                Enable the protections you want applied to every message.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "phoneNumbers",
                  label: "Delete messages containing phone numbers",
                  description:
                    "Remove posts that share phone numbers or contact details.",
                },
                {
                  id: "links",
                  label: "Delete messages containing links (http / https / www)",
                  description:
                    "Block outbound links and keep the group focused.",
                },
                {
                  id: "keywords",
                  label: "Delete messages containing configured keywords",
                  description:
                    "Auto-remove content that matches your blocked list.",
                },
                {
                  id: "spamProtection",
                  label: "Enable spam protection",
                  description:
                    "Use pattern detection to catch repeat offenders.",
                },
              ].map((item) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-6">
                    <Label className="text-base">{item.label}</Label>
                    <Switch
                      checked={
                        canEdit
                          ? toggles[item.id as keyof typeof toggles]
                          : false
                      }
                      disabled={!canEdit || isSyncing}
                      onCheckedChange={handleToggle(
                        item.id as keyof typeof toggles,
                      )}
                    />
                  </div>
                  <p className="text-sm text-[#6b6b6b]">{item.description}</p>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-[#fefcf9]">
            <CardHeader>
              <CardTitle>Keyword Configuration</CardTitle>
              <CardDescription>
                Add terms that should be auto-deleted from the group.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  placeholder="Add blocked keywords (comma separated)"
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  disabled={!canEdit || isSyncing}
                />
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={addKeywords}
                  disabled={!canEdit || isSyncing}
                >
                  Add Keywords
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="soft">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-[#6b6b6b]">
                Messages containing these words will be auto-deleted.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="bg-[#fefcf9]">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>
                A quick readout of moderation activity today.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Messages scanned today", value: "2,184" },
                { label: "Messages deleted", value: "128" },
                { label: "Spam messages detected", value: "46" },
                { label: "Most common spam type", value: "Promo links" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#e2dad0] bg-white px-5 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[#9a948b]">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-[#161616]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <footer className="text-center text-xs uppercase tracking-[0.2em] text-[#9a948b]">
          {isSyncing
            ? "Syncing changes..."
            : "Moderation actions are automated. Review WhatsApp policies."}
        </footer>
      </main>
    </div>
  );
}
