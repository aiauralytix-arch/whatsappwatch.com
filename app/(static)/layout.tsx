import type { Metadata } from "next";
import type { ReactNode } from "react";
import dynamic from 'next/dynamic'

const title = "WhatsApp Watch | Quiet WhatsApp Group Moderation";
const description =
  "Automated moderation for WhatsApp groups that removes spam, links, and numbers while keeping conversations calm and focused.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function StaticLayout({ children }: { children: ReactNode }) {
  const CrispWithNoSSR = dynamic(
    () => import('../../components/crisp/crisp')
  )

  return (
    <>
      <CrispWithNoSSR />
      {children}
    </>
  );
}
