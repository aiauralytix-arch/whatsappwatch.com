import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Stories | WhatsApp Watch";
const description =
  "Stories from WhatsApp groups that reduced spam and admin fatigue with quiet, automated moderation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/stories",
  },
  openGraph: {
    title,
    description,
    url: "/stories",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function StoriesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
