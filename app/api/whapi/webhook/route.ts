import { NextResponse } from "next/server";

import { processWhatsappModerationWorkflow } from "@/src/services/moderation/whapi-webhook.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const rawBody = await request.text();

  let parsedPayload: unknown = null;

  try {
    parsedPayload = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    parsedPayload = null;
  }

  if (parsedPayload) {
    try {
      await processWhatsappModerationWorkflow(
        parsedPayload as Parameters<typeof processWhatsappModerationWorkflow>[0],
      );
    } catch (error) {
      console.error(
        "Whatsapp moderation workflow error:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  return NextResponse.json({ status: "ok" });
}
