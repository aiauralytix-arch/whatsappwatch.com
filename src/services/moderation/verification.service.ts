import crypto from "crypto";

import { supabase } from "@/lib/supabase";
import type { PhoneVerificationRow } from "@/types/supabase";

const phoneVerificationSelect =
  "id, user_id, phone_number, otp_hash, expires_at, created_at, updated_at";

const hashOtp = (otp: string) =>
  crypto.createHash("sha256").update(otp).digest("hex");

export const getPhoneVerificationForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from("phone_verifications")
    .select(phoneVerificationSelect)
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to load phone verification.");
  }

  return (data as PhoneVerificationRow | null) ?? null;
};

export const createPhoneVerificationRequest = async (
  userId: string,
  phoneNumber: string,
  otpHash: string,
  expiresAt: Date,
) => {
  const { error } = await supabase.from("phone_verifications").upsert(
    {
      user_id: userId,
      phone_number: phoneNumber,
      otp_hash: otpHash,
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error("Failed to store verification code.");
  }
};

export const clearPhoneVerificationRequest = async (userId: string) => {
  const { error } = await supabase
    .from("phone_verifications")
    .delete()
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to clear verification code.");
  }
};

export const getUserPhoneVerificationStatus = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("phone_number, phone_verified_at")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw new Error("Failed to load phone verification status.");
  }

  return {
    phoneNumber: data?.phone_number ?? null,
    verifiedAt: data?.phone_verified_at ?? null,
  };
};

export const markPhoneVerified = async (userId: string, phoneNumber: string) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      phone_number: phoneNumber,
      phone_verified_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", userId)
    .select("phone_number, phone_verified_at")
    .single();

  if (error || !data) {
    throw new Error("Failed to save verified phone number.");
  }

  return {
    phoneNumber: data.phone_number ?? phoneNumber,
    verifiedAt: data.phone_verified_at ?? null,
  };
};

export const verifyPhoneOtpForUser = async (
  userId: string,
  phoneNumber: string,
  otp: string,
) => {
  const verification = await getPhoneVerificationForUser(userId);

  if (!verification) {
    throw new Error("Request a code first.");
  }

  if (verification.phone_number !== phoneNumber) {
    throw new Error("This code was sent to a different number.");
  }

  const expiresAt = new Date(verification.expires_at).getTime();
  if (Number.isNaN(expiresAt) || expiresAt < Date.now()) {
    await clearPhoneVerificationRequest(userId);
    throw new Error("That code expired. Request a new one.");
  }

  const storedHash = Buffer.from(verification.otp_hash, "hex");
  const providedHash = Buffer.from(hashOtp(otp), "hex");

  if (
    storedHash.length !== providedHash.length ||
    !crypto.timingSafeEqual(storedHash, providedHash)
  ) {
    throw new Error("Invalid code.");
  }

  const result = await markPhoneVerified(userId, phoneNumber);
  await clearPhoneVerificationRequest(userId);

  return result;
};
