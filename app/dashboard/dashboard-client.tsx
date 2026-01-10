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

type DashboardClientProps = {
  userName: string;
  userEmail: string;
};

const initialKeywords = ["giveaway", "promo", "loan"];

export default function DashboardClient({
  userName,
  userEmail,
}: DashboardClientProps) {
  const [toggles, setToggles] = React.useState({
    phoneNumbers: true,
    links: true,
    keywords: true,
    spamProtection: false,
  });
  const [keywordInput, setKeywordInput] = React.useState("");
  const [keywords, setKeywords] = React.useState<string[]>(initialKeywords);

  const handleToggle = (key: keyof typeof toggles) => (value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
  };

  const addKeywords = () => {
    const next = keywordInput
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

    if (next.length === 0) return;

    setKeywords((prev) => Array.from(new Set([...prev, ...next])));
    setKeywordInput("");
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
                Control how messages are moderated in your WhatsApp group.
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
                    <span>Buy a subscription.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a948b]">
                      Step 2
                    </span>
                    <span>
                      Add the provided number to your WhatsApp group.
                    </span>
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
              <CardTitle>Subscription &amp; Payments</CardTitle>
              <CardDescription>
                Manage your plan and unlock advanced moderation settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#9a948b]">
                  Current plan
                </p>
                <p className="mt-2 text-2xl font-semibold">Free</p>
                <p className="mt-2 text-sm text-[#6b6b6b]">
                  Payments handled securely.
                </p>
              </div>
              <Button className="w-full lg:w-auto">Upgrade Plan</Button>
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
                      checked={toggles[item.id as keyof typeof toggles]}
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
                />
                <Button
                  variant="outline"
                  className="whitespace-nowrap"
                  onClick={addKeywords}
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
          Moderation actions are automated. Review WhatsApp policies.
        </footer>
      </main>
    </div>
  );
}
