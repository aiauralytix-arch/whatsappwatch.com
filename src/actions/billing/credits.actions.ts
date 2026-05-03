"use server";

import { currentUser } from "@clerk/nextjs/server";

import { createDodoCreditCheckout } from "@/src/services/billing/dodo.service";
import { ensureCreditWallet } from "@/src/services/billing/credits.service";
import { upsertUserProfile } from "@/src/services/moderation/user.service";

export async function getWcCreditWallet() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await upsertUserProfile(user);
  return ensureCreditWallet(user.id);
}

export async function createWcCreditCheckout(packId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  await upsertUserProfile(user);

  const userName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    null;
  const userEmail = user.primaryEmailAddress?.emailAddress ?? null;

  return createDodoCreditCheckout({
    userId: user.id,
    userEmail,
    userName,
    packId,
  });
}
