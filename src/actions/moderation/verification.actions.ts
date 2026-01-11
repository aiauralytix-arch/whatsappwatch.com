"use server";

import crypto from "crypto";
import { currentUser } from "@clerk/nextjs/server";

import { upsertUserProfile } from "@/src/services/moderation/user.service";
import {
  createPhoneVerificationRequest,
  getUserPhoneVerificationStatus,
  verifyPhoneOtpForUser,
} from "@/src/services/moderation/verification.service";

const OTP_TTL_MS = 10 * 60 * 1000;

const normalizePhoneNumber = (rawPhone: string) =>
  rawPhone.replace(/[^\d]/g, "");

export async function getPhoneVerificationStatus() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await upsertUserProfile(user);

  return getUserPhoneVerificationStatus(user.id);
}

export async function sendPhoneVerificationOtp(rawPhone: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await upsertUserProfile(user);

  const phone = normalizePhoneNumber(rawPhone);
  if (phone.length < 10 || phone.length > 15) {
    throw new Error("Enter a valid phone number with country code.");
  }

  const token = process.env.WHAPI_API_TOKEN;
  if (!token) {
    throw new Error("WHAPI_API_TOKEN is not set.");
  }

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const messageBody = `Your WhatsAppWatch verification code is ${otp}. It expires in 10 minutes.`;

  const response = await fetch("https://gate.whapi.cloud/messages/text", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: phone,
      body: messageBody,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to send OTP. ${errorText ? `Details: ${errorText}` : ""}`.trim(),
    );
  }

  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

  await createPhoneVerificationRequest(user.id, phone, otpHash, expiresAt);

  return {
    sentTo: phone,
    expiresAt: expiresAt.getTime(),
  };
}

export async function verifyPhoneVerificationOtp(
  rawPhone: string,
  rawOtp: string,
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await upsertUserProfile(user);

  const phone = normalizePhoneNumber(rawPhone);
  const otp = rawOtp.replace(/[^\d]/g, "");

  if (phone.length < 10 || phone.length > 15) {
    throw new Error("Enter a valid phone number with country code.");
  }

  if (otp.length !== 6) {
    throw new Error("Enter the 6 digit code.");
  }

  const result = await verifyPhoneOtpForUser(user.id, phone, otp);

  return {
    verified: true,
    phoneNumber: result.phoneNumber,
    verifiedAt: result.verifiedAt,
  };
}
