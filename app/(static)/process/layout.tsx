import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Process | WhatsApp Watch";
const description =
  "See the three-step onboarding flow: add WhatsApp Watch to your group, choose the rules, and let quiet moderation run.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/process",
  },
  openGraph: {
    title,
    description,
    url: "/process",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function ProcessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
