"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { createWcCreditCheckout } from "@/src/actions/billing/credits.actions";

type PricingBuyButtonProps = {
  packId: string;
};

export default function PricingBuyButton({ packId }: PricingBuyButtonProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const [isOpening, setIsOpening] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const startCheckout = async () => {
    setError(null);

    if (isLoaded && !isSignedIn) {
      window.location.assign("/sign-up");
      return;
    }

    setIsOpening(true);

    try {
      const checkout = await createWcCreditCheckout(packId);
      window.location.assign(checkout.checkoutUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Failed to start checkout.",
      );
      setIsOpening(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        disabled={!isLoaded || isOpening}
        onClick={() => void startCheckout()}
      >
        {isOpening ? "Opening" : "Buy Credits"}
      </Button>
      {error ? <p className="text-xs leading-5 text-red-700">{error}</p> : null}
    </div>
  );
}
