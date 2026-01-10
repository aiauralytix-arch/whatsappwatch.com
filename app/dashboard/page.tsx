"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth, useUser } from "@clerk/nextjs";

import DashboardClient from "./dashboard-client";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const userName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Signed-in user";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "";

  return <DashboardClient userName={userName} userEmail={userEmail} />;
}
