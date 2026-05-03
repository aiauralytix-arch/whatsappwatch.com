"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BillingSectionProps = {
  balance: number | null;
  isLoading: boolean;
};

export default function BillingSection({
  balance,
  isLoading,
}: BillingSectionProps) {
  const visibleBalance =
    isLoading || balance === null ? "..." : balance.toLocaleString();

  return (
    <Card className="bg-[#fefcf9] p-6">
      <CardHeader className="gap-4">
        <CardDescription>WC Credits</CardDescription>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-3xl">
              {visibleBalance} credits
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-[#5a5a5a]">
              1 credit is used only when WhatsAppWatch successfully deletes a message.
            </p>
          </div>
          <Button asChild>
            <Link href="/pricing">Buy Credits</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {balance === 0 ? (
          <p className="text-sm text-[#6b6b6b]">
            Spam will still be detected at 0 credits, but messages will not be deleted.
          </p>
        ) : (
          <p className="text-sm text-[#6b6b6b]">
            New accounts start with 20 free credits.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
