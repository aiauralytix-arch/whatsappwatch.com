import { NextResponse } from "next/server";

import {
  processDodoWebhookEvent,
  verifyDodoWebhookSignature,
} from "@/src/services/billing/dodo.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const webhookId = request.headers.get("webhook-id");
  const webhookTimestamp = request.headers.get("webhook-timestamp");
  const webhookSignature = request.headers.get("webhook-signature");

  const isVerified = verifyDodoWebhookSignature({
    rawBody,
    webhookId,
    webhookTimestamp,
    webhookSignature,
  });

  if (!isVerified || !webhookId) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsedPayload: unknown = null;

  try {
    parsedPayload = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    await processDodoWebhookEvent({
      webhookId,
      payload: parsedPayload as Parameters<typeof processDodoWebhookEvent>[0]["payload"],
    });
  } catch (error) {
    console.error(
      "Dodo webhook processing error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
