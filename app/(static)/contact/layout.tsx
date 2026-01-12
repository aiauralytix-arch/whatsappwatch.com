import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Contact | WhatsApp Watch";
const description =
  "Contact WhatsApp Watch for onboarding help or rollout questions. Email support@whatsappwatch.com.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title,
    description,
    url: "/contact",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
