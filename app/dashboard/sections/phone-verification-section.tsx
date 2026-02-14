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
import CountryCodeSelect from "@/app/dashboard/components/country-code-select";
import {
  DEFAULT_COUNTRY_CODE,
  getCountryCallingCode,
  splitPhoneByCountryCode,
} from "@/app/dashboard/data/countries";

const defaultMessage =
  "Add your WhatsApp number to confirm you can receive moderation alerts.";

export default function PhoneVerificationSection() {
  const [selectedCountryCode, setSelectedCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "verified">("idle");
  const [message, setMessage] = useState(defaultMessage);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const composePhoneNumber = () => {
    const localDigits = phoneInput.replace(/\D/g, "");
    if (!localDigits) return "";
    const callingCode = getCountryCallingCode(selectedCountryCode);
    return `+${callingCode}${localDigits}`;
  };

  const hydratePhoneInput = (value: string) => {
    const parsed = splitPhoneByCountryCode(value);
    if (parsed) {
      setSelectedCountryCode(parsed.countryCode);
      setPhoneInput(parsed.localNumber);
      return;
    }

    setPhoneInput(value.replace(/\D/g, ""));
  };

  useEffect(() => {
    let isActive = true;

    void getPhoneVerificationStatus()
      .then((data) => {
        if (!isActive) return;
        if (data.phoneNumber && data.verifiedAt) {
          hydratePhoneInput(data.phoneNumber);
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
    const normalizedPhone = composePhoneNumber();
    if (!normalizedPhone) {
      setError("Enter a valid phone number.");
      return;
    }
    setError(null);
    setMessage(defaultMessage);
    setIsSending(true);

    try {
      const result = await sendPhoneVerificationOtp(normalizedPhone);
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
    const normalizedPhone = composePhoneNumber();
    if (!normalizedPhone) {
      setError("Enter a valid phone number.");
      return;
    }
    setError(null);
    setIsVerifying(true);

    try {
      const result = await verifyPhoneVerificationOtp(normalizedPhone, otpInput);
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
    <section className="relative z-20">
      <Card className="relative z-20 bg-[#fefcf9]">
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <CountryCodeSelect
              value={selectedCountryCode}
              onChange={setSelectedCountryCode}
              disabled={isSending || isVerifying}
              className="sm:w-[128px]"
            />
            <span className="hidden self-center text-sm text-[#9a948b] sm:inline">
              |
            </span>
            <Input
              placeholder="Enter number"
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
            Choose a country code, then enter your local number. Messages are
            sent via Whapi.Cloud.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
