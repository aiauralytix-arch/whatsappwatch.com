import { supabase } from "@/lib/supabase";

type WhatsappTextMessage = {
  id: string;
  text: string;
  groupId: string | null;
  senderId: string | null;
  timestamp: number | null;
};

type WhatsappWebhookMessage = {
  id?: string;
  type?: string;
  text?: { body?: string };
  image?: { caption?: string };
  chat_id?: string;
  chatId?: string;
  chat?: { id?: string };
  chat_name?: string;
  group_id?: string;
  groupId?: string;
  from_me?: boolean;
  author?: string;
  from?: string;
  from_name?: string;
  sender?: { id?: string };
  sender_id?: string;
  from_id?: string;
  timestamp?: number;
  source?: string;
};

type WhatsappWebhookPayload = {
  messages?: WhatsappWebhookMessage[];
  event?: {
    type?: string;
    event?: string;
  };
  channel_id?: string;
};

type ModerationResult = {
  messageId: string;
  spam: boolean;
  deleted: boolean;
};

type GroupModerationConfig = {
  groupId: string;
  userId: string;
  allowlist: Set<string>;
  blockedKeywords: string[];
};

type SpamEvaluation = {
  isSpam: boolean;
  hasUrl: boolean;
  hasNumber: boolean;
  matchedKeywords: string[];
};

const normalizePhoneDigits = (value?: string | null) => {
  if (!value || typeof value !== "string") return null;
  const digits = value.replace(/[^\d]/g, "");
  return digits.length > 0 ? digits : null;
};

const getPhoneMatchKey = (value?: string | null) => {
  const digits = normalizePhoneDigits(value);
  if (!digits) return null;
  return digits.length > 10 ? digits.slice(-10) : digits;
};

const isGroupChatId = (value?: string | null) =>
  Boolean(value && value.includes("@g.us"));

const extractGroupId = (message: WhatsappWebhookMessage) => {
  const candidate =
    message.chat_id ??
    message.chatId ??
    message.chat?.id ??
    message.group_id ??
    message.groupId ??
    (message.from && message.from.includes("@g.us") ? message.from : null);
  return isGroupChatId(candidate) ? candidate : null;
};

const extractSenderId = (message: WhatsappWebhookMessage) => {
  if (message.author) return message.author;
  if (message.sender?.id) return message.sender.id;
  if (message.sender_id) return message.sender_id;
  if (message.from_id) return message.from_id;
  if (message.from && !message.from.includes("@g.us")) return message.from;
  return null;
};

const extractTextMessagesFromWhatsappPayload = (
  payload: WhatsappWebhookPayload,
): WhatsappTextMessage[] => {
  if (!payload || !Array.isArray(payload.messages)) {
    return [];
  }

  return payload.messages
    .filter((message) => !message.from_me)
    .filter(
      (message) =>
        message.type === "text" && message.text?.body && message.id,
    )
    .map((message) => ({
      id: message.id as string,
      text: message.text?.body as string,
      groupId: extractGroupId(message),
      senderId: extractSenderId(message),
      timestamp: typeof message.timestamp === "number" ? message.timestamp : null,
    }));
};

const normalizeKeywordsForMatch = (keywords?: string[] | null) =>
  (keywords ?? [])
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

const evaluateTextMessageForRuleBasedSpam = (
  message: string,
  blockedKeywords: string[],
): SpamEvaluation => {
  if (!message || typeof message !== "string") {
    return {
      isSpam: false,
      hasUrl: false,
      hasNumber: false,
      matchedKeywords: [],
    };
  }

  const lower = message.toLowerCase();

  const hasUrl =
    lower.includes("http://") ||
    lower.includes("https://") ||
    lower.includes("www.");

  const hasNumber = /\d/.test(lower);

  const matchedKeywords = blockedKeywords.filter((keyword) =>
    lower.includes(keyword),
  );
  const hasSpamKeyword = matchedKeywords.length > 0;

  return {
    isSpam: hasUrl || hasNumber || hasSpamKeyword,
    hasUrl,
    hasNumber,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
  };
};

const deleteWhatsappMessageById = async (messageId: string) => {
  if (!messageId) {
    throw new Error("Message ID is required.");
  }

  const token = process.env.WHAPI_API_TOKEN;
  if (!token) {
    throw new Error("WHAPI_API_TOKEN is not set.");
  }

  const response = await fetch(
    `https://gate.whapi.cloud/messages/${messageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete WhatsApp message.");
  }

  try {
    const parsed = (await response.json()) as { success?: boolean };
    if (typeof parsed.success === "boolean") {
      return parsed.success;
    }
    return true;
  } catch {
    return true;
  }
};

const toMessageTimestamp = (value?: number | null) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const fetchModerationConfigByWhapiGroupId = async (
  whapiGroupIds: Array<string | null>,
) => {
  const uniqueGroupIds = Array.from(
    new Set(whapiGroupIds.filter((id): id is string => Boolean(id))),
  );

  if (uniqueGroupIds.length === 0) {
    return new Map<string, GroupModerationConfig>();
  }

  const { data: groupRows, error: groupError } = await supabase
    .from("moderation_groups")
    .select("id, user_id, verified_whapi_group_id")
    .in("verified_whapi_group_id", uniqueGroupIds);

  if (groupError) {
    throw new Error("Failed to load moderation groups.");
  }

  const groups = groupRows ?? [];
  const groupIds = groups.map((group) => group.id);

  if (groupIds.length === 0) {
    return new Map<string, GroupModerationConfig>();
  }

  const { data: settingsRows, error: settingsError } = await supabase
    .from("moderation_settings")
    .select("group_id, allowlist_phone_numbers, blocked_keywords")
    .in("group_id", groupIds);

  if (settingsError) {
    throw new Error("Failed to load moderation settings.");
  }

  const settingsByGroupId = new Map<
    string,
    { allowlist_phone_numbers?: string[]; blocked_keywords?: string[] }
  >();
  for (const row of settingsRows ?? []) {
    settingsByGroupId.set(row.group_id, {
      allowlist_phone_numbers: row.allowlist_phone_numbers ?? [],
      blocked_keywords: row.blocked_keywords ?? [],
    });
  }

  const configByWhapi = new Map<string, GroupModerationConfig>();
  for (const group of groups) {
    if (!group.verified_whapi_group_id) continue;
    const settings = settingsByGroupId.get(group.id);
    const allowlistNumbers = settings?.allowlist_phone_numbers ?? [];
    const matchKeys = allowlistNumbers
      .map((entry) => getPhoneMatchKey(entry))
      .filter((entry): entry is string => Boolean(entry));
    configByWhapi.set(group.verified_whapi_group_id, {
      groupId: group.id,
      userId: group.user_id,
      allowlist: new Set(matchKeys),
      blockedKeywords: normalizeKeywordsForMatch(settings?.blocked_keywords),
    });
  }

  return configByWhapi;
};

const storeDeletedMessage = async (
  config: GroupModerationConfig,
  message: WhatsappTextMessage,
  evaluation: SpamEvaluation,
) => {
  if (!message.groupId) return;
  const messageTimestamp = toMessageTimestamp(message.timestamp);

  const { error } = await supabase
    .from("moderation_deleted_messages")
    .upsert(
      {
        user_id: config.userId,
        group_id: config.groupId,
        whapi_group_id: message.groupId,
        whapi_message_id: message.id,
        sender_id: message.senderId,
        sender_key: getPhoneMatchKey(message.senderId),
        message_text: message.text,
        message_timestamp: messageTimestamp,
        matched_keywords: evaluation.matchedKeywords,
        has_url: evaluation.hasUrl,
        has_number: evaluation.hasNumber,
        spam_triggered: evaluation.isSpam,
      },
      { onConflict: "whapi_message_id" },
    );

  if (error) {
    throw new Error("Failed to store deleted message.");
  }
};

const isSenderAllowlisted = (
  message: WhatsappTextMessage,
  configByGroupId: Map<string, GroupModerationConfig>,
) => {
  if (!message.groupId || !message.senderId) return false;
  const allowlist = configByGroupId.get(message.groupId)?.allowlist;
  if (!allowlist || allowlist.size === 0) return false;
  const senderKey = getPhoneMatchKey(message.senderId);
  if (!senderKey) return false;
  return allowlist.has(senderKey);
};

export const processWhatsappModerationWorkflow = async (
  webhookPayload: WhatsappWebhookPayload,
): Promise<ModerationResult[]> => {
  const extractedTextMessages =
    extractTextMessagesFromWhatsappPayload(webhookPayload);
  const configByGroupId = await fetchModerationConfigByWhapiGroupId(
    extractedTextMessages.map((message) => message.groupId),
  );

  const moderationResults: ModerationResult[] = [];

  for (const message of extractedTextMessages) {
    const config = message.groupId
      ? configByGroupId.get(message.groupId) ?? null
      : null;
    const blockedKeywords = config?.blockedKeywords ?? [];
    const evaluation = evaluateTextMessageForRuleBasedSpam(
      message.text,
      blockedKeywords,
    );
    const isSpam = evaluation.isSpam;
    const isAllowlisted = isSenderAllowlisted(message, configByGroupId);
    const isGroupMessage = Boolean(message.groupId);

    let wasDeleted = false;

    if (isSpam && !isAllowlisted && isGroupMessage) {
      try {
        wasDeleted = await deleteWhatsappMessageById(message.id);
      } catch {
        wasDeleted = false;
      }
    }

    if (wasDeleted && config) {
      try {
        await storeDeletedMessage(config, message, evaluation);
      } catch (error) {
        console.error(
          "Failed to store deleted message:",
          error instanceof Error ? error.message : error,
        );
      }
    }

    moderationResults.push({
      messageId: message.id,
      spam: isSpam,
      deleted: wasDeleted,
    });
  }

  return moderationResults;
};
