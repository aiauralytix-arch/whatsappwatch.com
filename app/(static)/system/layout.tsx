import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "System | WhatsApp Watch";
const description =
  "Explore the moderation system behind WhatsApp Watch: automatic scanning, spam cleanup, and calm rule-setting.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/system",
  },
  openGraph: {
    title,
    description,
    url: "/system",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function SystemLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
