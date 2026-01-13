"use client";

import * as React from "react";

import { getDeletedMessages } from "@/src/actions/moderation/deleted-messages.actions";
import type { ModerationDeletedMessage } from "@/types/supabase";

type UseDeletedMessagesOptions = {
  activeGroupId: string | null;
  hasLoaded: boolean;
};

export const useDeletedMessages = ({
  activeGroupId,
  hasLoaded,
}: UseDeletedMessagesOptions) => {
  const [messages, setMessages] = React.useState<ModerationDeletedMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    if (!hasLoaded || !activeGroupId) return;
    setIsLoading(true);
    try {
      const next = await getDeletedMessages(activeGroupId);
      setMessages(next);
    } catch {
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeGroupId, hasLoaded]);

  React.useEffect(() => {
    if (!hasLoaded || !activeGroupId) {
      setMessages([]);
      return;
    }

    void refresh();
  }, [activeGroupId, hasLoaded, refresh]);

  return { messages, isLoading, refresh };
};
