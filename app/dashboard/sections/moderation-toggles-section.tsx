"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { ToggleState } from "@/app/dashboard/types";

type ModerationTogglesSectionProps = {
  toggles: ToggleState;
  canEdit: boolean;
  isSyncing: boolean;
  onToggle: (key: keyof ToggleState) => (value: boolean) => void;
};

const toggleItems: Array<{
  id: keyof ToggleState;
  label: string;
  description: string;
}> = [
  {
    id: "phoneNumbers",
    label: "Delete messages containing phone numbers",
    description: "Remove posts that share phone numbers or contact details.",
  },
  {
    id: "links",
    label: "Delete messages containing links (http / https / www)",
    description: "Block outbound links and keep the group focused.",
  },
  {
    id: "groupInvites",
    label: "Delete messages containing WhatsApp group invites",
    description: "Block shared invite links to other groups.",
  },
  {
    id: "contacts",
    label: "Delete messages sharing WhatsApp contacts",
    description: "Remove shared contact cards (vCards) from the group.",
  },
  {
    id: "keywords",
    label: "Delete messages containing configured keywords",
    description: "Auto-remove content that matches your blocked list.",
  },
];

export default function ModerationTogglesSection({
  toggles,
  canEdit,
  isSyncing,
  onToggle,
}: ModerationTogglesSectionProps) {
  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Moderation Toggles</CardTitle>
          <CardDescription>
            Enable the protections you want applied to every message.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {toggleItems.map((item) => (
            <div key={item.id} className="space-y-3">
              <div className="flex items-center justify-between gap-6">
                <Label className="text-base">{item.label}</Label>
                <Switch
                  checked={canEdit ? toggles[item.id] : false}
                  disabled={!canEdit || isSyncing}
                  onCheckedChange={onToggle(item.id)}
                />
              </div>
              <p className="text-sm text-[#6b6b6b]">{item.description}</p>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
