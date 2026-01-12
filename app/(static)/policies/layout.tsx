import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Policies | WhatsApp Watch";
const description =
  "Service scope, refunds, and acceptable use policies for WhatsApp Watch moderation tools.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/policies",
  },
  openGraph: {
    title,
    description,
    url: "/policies",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function PoliciesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
