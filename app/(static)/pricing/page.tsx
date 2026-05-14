import type { Metadata } from "next";

import { creditPacks } from "@/src/lib/billing/credit-packs";
import SiteNav from "../components/site-nav";
import PricingBuyButton from "./pricing-buy-button";

export const metadata: Metadata = {
  title: "Pricing | WhatsApp Watch",
  description:
    "Buy prepaid WC credits for WhatsApp moderation. One credit is used only when a message is successfully deleted.",
  alternates: {
    canonical: "/pricing",
  },
};

type PricingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const pricingNavItems = [
  { href: "/process", label: "Process" },
  { href: "/system", label: "System" },
  { href: "/pricing", label: "Pricing" },
];

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const resolvedSearchParams = await searchParams;
  const showTestingPack = Object.prototype.hasOwnProperty.call(
    resolvedSearchParams ?? {},
    "testing",
  );
  const visiblePacks = creditPacks.filter(
    (pack) => !pack.isTestingOnly || showTestingPack,
  );

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#161616]">
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#f7b787] opacity-50 blur-3xl" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[#8cc7c0] opacity-50 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(90deg,transparent_0px,transparent_34px,rgba(0,0,0,0.05)_35px)] opacity-25" />
        </div>

        <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-20 pt-12 sm:px-10 lg:px-16">
          <SiteNav
            items={pricingNavItems}
            actions={[{ href: "/sign-in", label: "Sign in" }]}
            primaryAction={{ href: "/dashboard", label: "Dashboard" }}
          />

          <div className="mt-20 grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-8">
              <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
                Pricing
              </p>
              <h1 className="font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Buy credits. Pay only when spam is removed.
              </h1>
              <p className="max-w-xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
                WC credits are prepaid and never expire. WhatsApp Watch uses 1
                credit only after Whapi confirms a message was deleted.
              </p>
              <div className="grid gap-3 text-sm text-[#3c3c3c] sm:grid-cols-3">
                {[
                  "20 free credits for new users",
                  "No charge for failed deletes",
                  "Detection continues at 0 credits",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#e2dad0] bg-white/75 p-4"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {visiblePacks.map((pack) => (
                <article
                  key={pack.id}
                  className="flex flex-col rounded-3xl border border-[#d5cec3] bg-[#fefcf9] p-6 shadow-[0_30px_80px_rgba(20,20,20,0.08)]"
                >
                  <div className="flex flex-1 flex-col">
                    <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.25em] text-[#8b8177]">
                      {pack.name}
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <h2 className="font-[var(--font-space)] text-3xl font-semibold">
                        ₹{pack.priceInr}
                      </h2>
                      <p className="text-sm font-semibold text-[#4b4b4b]">
                        {pack.credits.toLocaleString()} credits
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[#5a5a5a]">
                      Good for {pack.credits.toLocaleString()} successful
                      message deletes across your groups.
                    </p>
                  </div>
                  <div className="mt-6">
                    <PricingBuyButton packId={pack.id} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
