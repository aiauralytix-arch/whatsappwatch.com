import { supabase } from "@/lib/supabase";
import { defaultSettings } from "@/src/lib/moderation/settings-constants";

type WhatsappModerationMessage = {
  id: string;
  type: "text" | "group_invite";
  text: string;
  inviteUrl: string | null;
  groupId: string | null;
  senderId: string | null;
  timestamp: number | null;
};

type WhatsappWebhookMessage = {
  id?: string;
  type?: string;
  text?: { body?: string };
  image?: { caption?: string };
  group_invite?: { body?: string; url?: string; title?: string };
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
  blockPhoneNumbers: boolean;
  blockLinks: boolean;
  blockGroupInvites: boolean;
  blockKeywords: boolean;
};

type SpamEvaluation = {
  isSpam: boolean;
  hasUrl: boolean;
  hasNumber: boolean;
  matchedKeywords: string[];
};

type RuleBasedFlags = {
  blockPhoneNumbers: boolean;
  blockLinks: boolean;
  blockGroupInvites: boolean;
  blockKeywords: boolean;
};

const PHONE_DIGIT_MIN = 8;
const PHONE_DIGIT_MAX = 15;
const PHONE_CANDIDATE_PATTERN = /(?:\+?\d[\d\s().-]{6,}\d)/g;

const isPhoneNumberLike = (value?: string | null) => {
  if (!value || typeof value !== "string") return false;
  const matches = value.match(PHONE_CANDIDATE_PATTERN);
  if (!matches) return false;
  return matches.some((match) => {
    const digits = match.replace(/\D/g, "");
    return (
      digits.length >= PHONE_DIGIT_MIN && digits.length <= PHONE_DIGIT_MAX
    );
  });
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

const extractModerationMessagesFromWhatsappPayload = (
  payload: WhatsappWebhookPayload,
): WhatsappModerationMessage[] => {
  if (!payload || !Array.isArray(payload.messages)) {
    return [];
  }

  return payload.messages
    .filter((message) => !message.from_me)
    .filter((message) => Boolean(message.id))
    .flatMap<WhatsappModerationMessage>(
      (message): WhatsappModerationMessage[] => {
        const groupId = extractGroupId(message);
        const senderId = extractSenderId(message);
        const timestamp =
          typeof message.timestamp === "number" ? message.timestamp : null;

        if (message.type === "text" && message.text?.body) {
          return [
            {
              id: message.id as string,
              type: "text",
              text: message.text.body,
              inviteUrl: null,
              groupId,
              senderId,
              timestamp,
            },
          ];
        }

        if (message.type === "group_invite") {
          const inviteText =
            message.group_invite?.body ??
            message.group_invite?.url ??
            message.group_invite?.title ??
            "Group invite";
          const inviteUrl =
            message.group_invite?.url ?? message.group_invite?.body ?? null;

          return [
            {
              id: message.id as string,
              type: "group_invite",
              text: inviteText,
              inviteUrl,
              groupId,
              senderId,
              timestamp,
            },
          ];
        }

        return [];
      },
    );
};

const normalizeKeywordsForMatch = (keywords?: string[] | null) =>
  (keywords ?? [])
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

const getRuleBasedFlags = (
  config?: GroupModerationConfig | null,
): RuleBasedFlags => {
  if (!config) {
    return {
      blockPhoneNumbers: defaultSettings.block_phone_numbers,
      blockLinks: defaultSettings.block_links,
      blockGroupInvites: defaultSettings.block_group_invites,
      blockKeywords: defaultSettings.block_keywords,
    };
  }

  return {
    blockPhoneNumbers: config.blockPhoneNumbers,
    blockLinks: config.blockLinks,
    blockGroupInvites: config.blockGroupInvites,
    blockKeywords: config.blockKeywords,
  };
};

const evaluateTextMessageForRuleBasedSpam = (
  message: string,
  blockedKeywords: string[],
  flags: RuleBasedFlags,
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
    /\bhttps?\b/i.test(message) || // http or https (any case, no "://" needed)
    /\bwww\b/i.test(message) || // bare www
    /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/i.test(message); // example.com, sub.domain.co.uk, my-site.io

  const hasNumber = isPhoneNumberLike(message);

  const matchedKeywords = blockedKeywords.filter((keyword) =>
    lower.includes(keyword),
  );
  const hasSpamKeyword = matchedKeywords.length > 0;
  const blockLinks = flags.blockLinks && hasUrl;
  const blockNumbers = flags.blockPhoneNumbers && hasNumber;
  const blockKeywords = flags.blockKeywords && hasSpamKeyword;

  return {
    isSpam: blockLinks || blockNumbers || blockKeywords,
    hasUrl,
    hasNumber,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
  };
};

const evaluateModerationMessageForSpam = (
  message: WhatsappModerationMessage,
  config?: GroupModerationConfig | null,
): SpamEvaluation => {
  const flags = getRuleBasedFlags(config);

  if (message.type === "group_invite") {
    const hasUrl =
      Boolean(message.inviteUrl) ||
      (typeof message.text === "string" &&
        message.text.toLowerCase().includes("http"));

    return {
      isSpam: flags.blockGroupInvites,
      hasUrl,
      hasNumber: false,
      matchedKeywords: [],
    };
  }

  return evaluateTextMessageForRuleBasedSpam(
    message.text,
    config?.blockedKeywords ?? [],
    flags,
  );
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
    .select(
      "group_id, allowlist_phone_numbers, blocked_keywords, block_phone_numbers, block_links, block_group_invites, block_keywords",
    )
    .in("group_id", groupIds);

  if (settingsError) {
    throw new Error("Failed to load moderation settings.");
  }

  const settingsByGroupId = new Map<
    string,
    {
      allowlist_phone_numbers?: string[];
      blocked_keywords?: string[];
      block_phone_numbers?: boolean;
      block_links?: boolean;
      block_group_invites?: boolean;
      block_keywords?: boolean;
    }
  >();
  for (const row of settingsRows ?? []) {
    settingsByGroupId.set(row.group_id, {
      allowlist_phone_numbers: row.allowlist_phone_numbers ?? [],
      blocked_keywords: row.blocked_keywords ?? [],
      block_phone_numbers: row.block_phone_numbers ?? false,
      block_links: row.block_links ?? false,
      block_group_invites: row.block_group_invites ?? false,
      block_keywords: row.block_keywords ?? false,
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
      blockPhoneNumbers:
        settings?.block_phone_numbers ?? defaultSettings.block_phone_numbers,
      blockLinks: settings?.block_links ?? defaultSettings.block_links,
      blockGroupInvites:
        settings?.block_group_invites ?? defaultSettings.block_group_invites,
      blockKeywords: settings?.block_keywords ?? defaultSettings.block_keywords,
    });
  }

  return configByWhapi;
};

const storeDeletedMessage = async (
  config: GroupModerationConfig,
  message: WhatsappModerationMessage,
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
  message: WhatsappModerationMessage,
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
  const extractedMessages =
    extractModerationMessagesFromWhatsappPayload(webhookPayload);
  const configByGroupId = await fetchModerationConfigByWhapiGroupId(
    extractedMessages.map((message) => message.groupId),
  );

  const moderationResults: ModerationResult[] = [];

  for (const message of extractedMessages) {
    const config = message.groupId
      ? configByGroupId.get(message.groupId) ?? null
      : null;
    const evaluation = evaluateModerationMessageForSpam(message, config);
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
