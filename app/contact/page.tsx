"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div
      className="min-h-screen bg-[#f6f3ee] text-[#161616]"
    >
      <style jsx global>{`
        :root {
          --shadow-soft: 0 30px 80px rgba(20, 20, 20, 0.08);
        }
        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(16px, -18px, 0) rotate(2deg);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }
      `}</style>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#f7b787] opacity-60 blur-3xl"
            style={{ animation: "drift 18s ease-in-out infinite" }}
          />
          <div
            className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[#8cc7c0] opacity-60 blur-3xl"
            style={{ animation: "drift 22s ease-in-out infinite" }}
          />
          <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_65%)]" />
          <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(90deg,transparent_0px,transparent_34px,rgba(0,0,0,0.05)_35px)] opacity-30" />
        </div>

        <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-20 pt-12 sm:px-10 lg:px-16">
          <nav className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-[#3a3a3a]">
            <div className="font-[var(--font-space)] text-base font-semibold tracking-[0.35em]">
              WHATSAPP WATCH
            </div>
            <div className="hidden items-center gap-8 font-[var(--font-plex)] text-xs sm:flex">
              <a className="transition hover:text-[#161616]" href="/process">
                Process
              </a>
              <a className="transition hover:text-[#161616]" href="/system">
                System
              </a>
              <a className="transition hover:text-[#161616]" href="/stories">
                Stories
              </a>
              <a className="transition hover:text-[#161616]" href="/contact">
                Contact
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/sign-in"
                className="hidden rounded-full border border-transparent px-3 py-2 font-[var(--font-plex)] text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:border-[#161616] hover:text-[#161616] sm:inline-flex"
              >
                Sign in
              </a>
              <a
                href="/sign-up"
                className="hidden rounded-full border border-transparent px-3 py-2 font-[var(--font-plex)] text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:border-[#161616] hover:text-[#161616] sm:inline-flex"
              >
                Sign up
              </a>
              <a
                href="/contact"
                className="rounded-full border border-[#161616] px-4 py-2 font-[var(--font-plex)] text-xs tracking-[0.2em] transition hover:bg-[#161616] hover:text-[#f6f3ee]"
              >
                Book Signal
              </a>
            </div>
          </nav>

          <div className="mt-24 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
                Contact
              </p>
              <h1 className="font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                A calm place to reach us.
              </h1>
              <p className="max-w-xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
                Whether you need onboarding help or want to discuss a larger
                rollout, we respond with clarity and care.
              </p>
              <div className="space-y-3 text-sm text-[#4b4b4b]">
                <p>
                  Email:{" "}
                  <span className="font-semibold text-[#161616]">
                    support@whatsappwatch.com
                  </span>
                </p>
                <p>
                  Typical response time:{" "}
                  <span className="font-semibold text-[#161616]">
                    within 24 hours
                  </span>
                </p>
              </div>
            </div>
            <div className="relative flex flex-col justify-between rounded-3xl border border-[#d5cec3] bg-white/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="absolute right-6 top-6 rounded-full bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f6f3ee]">
                Support
              </div>
              <div className="space-y-6">
                <h2 className="font-[var(--font-space)] text-2xl font-semibold">
                  Leave a note
                </h2>
                <p className="font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
                  This form is for layout only. We will connect you when we go
                  live.
                </p>
              </div>
              <div className="space-y-4">
                <Input placeholder="Name" />
                <Input placeholder="Email address" type="email" />
                <Input placeholder="Message" />
                <Button className="w-full">Send message</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
