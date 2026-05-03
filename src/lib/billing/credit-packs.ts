export const INITIAL_FREE_WC_CREDITS = 20;
export const WC_CREDIT_CURRENCY = "INR";

export const creditPacks = [
  {
    id: "testing",
    name: "Testing",
    priceInr: 10,
    credits: 10,
    productIdEnv: "DODO_WC_TESTING_PRODUCT_ID",
    isTestingOnly: true,
  },
  {
    id: "starter",
    name: "Starter",
    priceInr: 199,
    credits: 250,
    productIdEnv: "DODO_WC_STARTER_PRODUCT_ID",
    isTestingOnly: false,
  },
  {
    id: "growth",
    name: "Growth",
    priceInr: 499,
    credits: 750,
    productIdEnv: "DODO_WC_GROWTH_PRODUCT_ID",
    isTestingOnly: false,
  },
  {
    id: "pro",
    name: "Pro",
    priceInr: 999,
    credits: 2000,
    productIdEnv: "DODO_WC_PRO_PRODUCT_ID",
    isTestingOnly: false,
  },
  {
    id: "power",
    name: "Power",
    priceInr: 2499,
    credits: 6000,
    productIdEnv: "DODO_WC_POWER_PRODUCT_ID",
    isTestingOnly: false,
  },
] as const;

export type CreditPackId = (typeof creditPacks)[number]["id"];

export const getCreditPack = (packId: string) =>
  creditPacks.find((pack) => pack.id === packId) ?? null;

export const getCreditPackProductId = (packId: string) => {
  const pack = getCreditPack(packId);
  if (!pack) return null;
  return process.env[pack.productIdEnv] ?? null;
};
