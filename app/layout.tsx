import type { Metadata } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

export const dynamic = "force-dynamic"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Axiom Form",
  description: "Modern operational systems",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${space.variable} ${plex.variable}`}
    >
      <body className="bg-[#f6f3ee] text-[#161616] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}