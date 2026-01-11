"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  sendPhoneVerificationOtp,
  getPhoneVerificationStatus,
  verifyPhoneVerificationOtp,
} from "@/src/actions/moderation/verification.actions";

const defaultMessage =
  "Add your WhatsApp number to confirm you can receive moderation alerts.";

export default function PhoneVerificationSection() {
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "verified">("idle");
  const [message, setMessage] = useState(defaultMessage);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let isActive = true;

    void getPhoneVerificationStatus()
      .then((data) => {
        if (!isActive) return;
        if (data.phoneNumber && data.verifiedAt) {
          setPhoneInput(data.phoneNumber);
          setStatus("verified");
          setMessage(`Verified number: ${data.phoneNumber}.`);
        }
      })
      .catch(() => {});

    return () => {
      isActive = false;
    };
  }, []);

  const handleSendOtp = async () => {
    if (isSending) return;
    setError(null);
    setMessage(defaultMessage);
    setIsSending(true);

    try {
      const result = await sendPhoneVerificationOtp(phoneInput);
      setStatus("sent");
      setMessage(
        `Code sent to ${result.sentTo}. It expires in 10 minutes.`,
      );
      setOtpInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (isVerifying) return;
    setError(null);
    setIsVerifying(true);

    try {
      const result = await verifyPhoneVerificationOtp(phoneInput, otpInput);
      setStatus("verified");
      setMessage(
        `Phone verified${result.phoneNumber ? `: ${result.phoneNumber}` : ""}. You can now receive WhatsApp alerts.`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section>
      <Card className="bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="WhatsApp number with country code"
              value={phoneInput}
              onChange={(event) => setPhoneInput(event.target.value)}
              inputMode="tel"
              disabled={isSending || isVerifying}
            />
            <Button
              variant="outline"
              className="whitespace-nowrap"
              onClick={handleSendOtp}
              disabled={
                isSending ||
                isVerifying ||
                phoneInput.trim().length === 0
              }
            >
              {isSending ? "Sending..." : "Send OTP"}
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Enter 6 digit code"
              value={otpInput}
              onChange={(event) => setOtpInput(event.target.value)}
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              disabled={
                isSending ||
                isVerifying ||
                status !== "sent"
              }
            />
            <Button
              className="whitespace-nowrap"
              onClick={handleVerifyOtp}
              disabled={
                isSending ||
                isVerifying ||
                status !== "sent" ||
                otpInput.trim().length !== 6
              }
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
          {error ? (
            <p className="text-sm text-[#b23a2b]">{error}</p>
          ) : null}
          <p className="text-xs text-[#6b6b6b]">
            Use the full number with country code. Messages are sent via
            Whapi.Cloud.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
