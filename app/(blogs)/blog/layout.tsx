import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Blog | WhatsApp Watch";
const description =
  "Practical guides for removing spam, links, numbers, and noise from WhatsApp groups.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title,
    description,
    url: "/blog",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
