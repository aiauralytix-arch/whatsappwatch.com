"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ModerationDeletedMessage } from "@/types/supabase";

type DeletedMessagesSectionProps = {
  messages: ModerationDeletedMessage[];
  isLoading: boolean;
  groupName?: string | null;
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
};

const buildTriggerBadges = (message: ModerationDeletedMessage) => {
  const triggers: string[] = [];
  if (message.hasUrl) triggers.push("URL");
  if (message.hasNumber) triggers.push("Number");
  if (message.matchedKeywords.length > 0) triggers.push("Keyword");
  return triggers;
};

export default function DeletedMessagesSection({
  messages,
  isLoading,
  groupName,
}: DeletedMessagesSectionProps) {
  const titleSuffix = groupName ? `for ${groupName}` : "for this group";

  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Deleted Messages</CardTitle>
          <CardDescription>
            Recent messages that were auto-deleted {titleSuffix}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-[#6b6b6b]">Loading deleted messages…</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-[#6b6b6b]">
              No deleted messages recorded yet.
            </p>
          ) : (
            messages.map((message) => {
              const triggers = buildTriggerBadges(message);
              const timeLabel =
                message.messageTimestamp ?? message.createdAt ?? null;
              const senderLabel =
                message.senderId ?? message.senderKey ?? "Unknown sender";

              return (
                <div
                  key={message.id}
                  className="rounded-2xl border border-[#e2dad0] bg-white p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-sm font-medium text-[#161616]">
                      {message.messageText}
                    </p>
                    <Badge variant="soft" className="shrink-0">
                      Deleted
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#6b6b6b]">
                    <span>Sender: {senderLabel}</span>
                    <span>Time: {formatTimestamp(timeLabel)}</span>
                    <span className="break-all">
                      Message ID: {message.whapiMessageId}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {triggers.length === 0 ? (
                      <Badge variant="soft">No trigger captured</Badge>
                    ) : (
                      triggers.map((trigger) => (
                        <Badge key={trigger} variant="soft">
                          {trigger}
                        </Badge>
                      ))
                    )}
                    {message.matchedKeywords.map((keyword) => (
                      <Badge key={keyword} variant="soft" className="gap-1">
                        <span>{keyword}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </section>
  );
}
