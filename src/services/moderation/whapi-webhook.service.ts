type WhatsappTextMessage = {
  id: string;
  text: string;
};

type WhatsappWebhookPayload = {
  messages?: Array<{
    id?: string;
    type?: string;
    text?: { body?: string };
  }>;
};

type ModerationResult = {
  messageId: string;
  spam: boolean;
  deleted: boolean;
};

const spamKeywords = [
  "join group",
  "join this group",
  "share group",
  "whatsapp group",
  "telegram group",
  "earn money",
  "make money",
  "free money",
  "online earning",
  "click link",
];

const extractTextMessagesFromWhatsappPayload = (
  payload: WhatsappWebhookPayload,
): WhatsappTextMessage[] => {
  if (!payload || !Array.isArray(payload.messages)) {
    return [];
  }

  return payload.messages
    .filter((message) => message.type === "text" && message.text?.body && message.id)
    .map((message) => ({
      id: message.id as string,
      text: message.text?.body as string,
    }));
};

const evaluateTextMessageForRuleBasedSpam = (message: string) => {
  if (!message || typeof message !== "string") {
    return false;
  }

  const lower = message.toLowerCase();

  const hasUrl =
    lower.includes("http://") ||
    lower.includes("https://") ||
    lower.includes("www.");

  const hasNumber = /\d/.test(lower);

  const hasSpamKeyword = spamKeywords.some((keyword) =>
    lower.includes(keyword),
  );

  return hasUrl || hasNumber || hasSpamKeyword;
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
    return parsed.success === true;
  } catch {
    throw new Error("Invalid response from delete API.");
  }
};

export const processWhatsappModerationWorkflow = async (
  webhookPayload: WhatsappWebhookPayload,
): Promise<ModerationResult[]> => {
  const extractedTextMessages =
    extractTextMessagesFromWhatsappPayload(webhookPayload);

  const moderationResults: ModerationResult[] = [];

  for (const message of extractedTextMessages) {
    const isSpam = evaluateTextMessageForRuleBasedSpam(message.text);

    let wasDeleted = false;

    if (isSpam) {
      try {
        wasDeleted = await deleteWhatsappMessageById(message.id);
      } catch {
        wasDeleted = false;
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
