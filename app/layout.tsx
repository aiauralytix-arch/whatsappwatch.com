import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"

export const dynamic = "force-dynamic"

const baseTitle = "WhatsApp Watch";
const baseDescription =
  "Quiet and automated moderation for WhatsApp groups.";

export const metadata: Metadata = {
  metadataBase: new URL("https://whatsappwatch.com"),
  title: baseTitle,
  description: baseDescription,
  openGraph: {
    title: baseTitle,
    description: baseDescription,
    url: "/",
    siteName: "WhatsApp Watch",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: baseTitle,
    description: baseDescription,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-[#f6f3ee] text-[#161616] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
