import crypto from "node:crypto";

import { supabase } from "@/lib/supabase";
import {
  WC_CREDIT_CURRENCY,
  getCreditPack,
  getCreditPackProductId,
} from "@/src/lib/billing/credit-packs";
import { addPurchasedCredits } from "./credits.service";

type DodoWebhookPayload = {
  type?: string;
  data?: {
    object?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  } & Record<string, unknown>;
};

const getDodoApiBaseUrl = () =>
  process.env.DODO_PAYMENTS_API_BASE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com");

const getAppUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const getComparableSignatures = (signatureHeader: string) =>
  signatureHeader
    .split(/\s+/)
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.replace(/^v\d+=?/, ""))
    .filter(Boolean);

const getWebhookSecretBytes = (secret: string) => {
  const normalizedSecret = secret.trim();

  if (normalizedSecret.startsWith("whsec_")) {
    return Buffer.from(normalizedSecret.slice("whsec_".length), "base64");
  }

  return Buffer.from(normalizedSecret, "utf8");
};

const timingSafeStringEqual = (a: string, b: string) => {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
};

export const verifyDodoWebhookSignature = ({
  rawBody,
  webhookId,
  webhookTimestamp,
  webhookSignature,
}: {
  rawBody: string;
  webhookId: string | null;
  webhookTimestamp: string | null;
  webhookSignature: string | null;
}): { verified: boolean; reason?: string } => {
  const secret = (
    process.env.DODO_PAYMENTS_WEBHOOK_SECRET ??
    process.env.DODO_PAYMENTS_WEBHOOK_KEY ??
    ""
  ).trim();

  if (!secret) {
    return { verified: false, reason: "missing_webhook_secret" };
  }

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return { verified: false, reason: "missing_webhook_headers" };
  }

  const signedPayload = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const digest = crypto
    .createHmac("sha256", getWebhookSecretBytes(secret))
    .update(signedPayload)
    .digest();
  const expectedBase64 = digest.toString("base64");
  const expectedHex = digest.toString("hex");

  const signatureMatches = getComparableSignatures(webhookSignature).some(
    (candidate) =>
      timingSafeStringEqual(candidate, expectedBase64) ||
      timingSafeStringEqual(candidate, expectedHex),
  );

  return signatureMatches
    ? { verified: true }
    : { verified: false, reason: "signature_mismatch" };
};

export const createDodoCreditCheckout = async ({
  userId,
  userEmail,
  userName,
  packId,
}: {
  userId: string;
  userEmail: string | null;
  userName: string | null;
  packId: string;
}) => {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("DODO_PAYMENTS_API_KEY is not set.");
  }

  const pack = getCreditPack(packId);
  const productId = getCreditPackProductId(packId);

  if (!pack || !productId) {
    throw new Error("Invalid or unconfigured WC credit pack.");
  }

  const appUrl = getAppUrl();
  const response = await fetch(`${getDodoApiBaseUrl()}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      billing_currency: WC_CREDIT_CURRENCY,
      allowed_payment_method_types: [
        "upi_collect",
        "upi_intent",
        "credit",
        "debit",
      ],
      return_url: `${appUrl}/dashboard?billing=return`,
      cancel_url: `${appUrl}/dashboard?billing=cancelled`,
      metadata: {
        clerk_user_id: userId,
        pack_id: pack.id,
        credits: String(pack.credits),
        currency: WC_CREDIT_CURRENCY,
        user_email: userEmail ?? "",
        user_name: userName ?? "",
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create Dodo checkout session.");
  }

  const parsed = (await response.json()) as {
    session_id?: string;
    checkout_url?: string | null;
  };

  if (!parsed.checkout_url) {
    throw new Error("Dodo checkout did not return a checkout URL.");
  }

  return {
    sessionId: parsed.session_id ?? null,
    checkoutUrl: parsed.checkout_url,
  };
};

const getObjectValue = (
  object: Record<string, unknown> | undefined,
  keys: string[],
) => {
  if (!object) return null;

  for (const key of keys) {
    const value = object[key];
    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }

  return null;
};

const extractPaymentObject = (payload: DodoWebhookPayload) => {
  const data = payload.data;
  const object =
    data?.object && typeof data.object === "object"
      ? data.object
      : data && typeof data === "object"
        ? data
        : {};
  const metadataObject = object.metadata;
  const metadata =
    metadataObject && typeof metadataObject === "object"
      ? (metadataObject as Record<string, unknown>)
      : data?.metadata && typeof data.metadata === "object"
        ? data.metadata
        : {};

  return { object, metadata };
};

export const processDodoWebhookEvent = async ({
  webhookId,
  payload,
}: {
  webhookId: string;
  payload: DodoWebhookPayload;
}) => {
  const eventType = payload.type ?? "unknown";
  const { error: eventError } = await supabase.from("billing_events").insert({
    provider: "dodo",
    provider_event_id: webhookId,
    event_type: eventType,
    payload,
    processed_at: new Date().toISOString(),
  });

  if (eventError) {
    if (eventError.code === "23505") {
      return { processed: false, duplicate: true };
    }

    throw new Error("Failed to record Dodo webhook event.");
  }

  if (eventType !== "payment.succeeded") {
    return { processed: false, duplicate: false };
  }

  const { object, metadata } = extractPaymentObject(payload);
  const userId = getObjectValue(metadata, ["clerk_user_id", "user_id"]);
  const packId = getObjectValue(metadata, ["pack_id"]);
  const paymentId =
    getObjectValue(object, ["payment_id", "id"]) ?? webhookId;
  const pack = packId ? getCreditPack(packId) : null;

  if (!userId || !pack) {
    throw new Error("Dodo payment webhook is missing WC credit metadata.");
  }

  await addPurchasedCredits({
    userId,
    credits: pack.credits,
    referenceId: paymentId,
    metadata: {
      provider: "dodo",
      webhookId,
      packId: pack.id,
      packName: pack.name,
      priceInr: pack.priceInr,
      currency: WC_CREDIT_CURRENCY,
      paymentId,
      totalAmount: getObjectValue(object, ["total_amount", "amount"]),
    },
  });

  return { processed: true, duplicate: false };
};
