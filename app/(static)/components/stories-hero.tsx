"use client";

import Link from "next/link";

import SiteNav from "./site-nav";

const outcomeItems = [
  "Less noise, more engagement",
  "Admins spend time with the community",
  "Members feel safer sharing",
];

export default function StoriesHero() {
  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-20 pt-12 sm:px-10 lg:px-16">
      <SiteNav />

      <div className="mt-24 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
            Stories
          </p>
          <h1 className="font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Calm moderation stories from real communities.
          </h1>
          <p className="max-w-xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
            Groups of every size use WhatsApp Watch to remove noise and bring
            focus back to conversation. Here are a few of their stories.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-full bg-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#f6f3ee] transition hover:translate-y-[-2px] hover:shadow-[var(--shadow-soft)]"
            >
              Start Protecting My Group
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] transition hover:bg-[#161616] hover:text-[#f6f3ee]"
            >
              Share Your Story
            </Link>
          </div>
        </div>
        <div className="relative flex flex-col justify-between rounded-3xl border border-[#d5cec3] bg-white/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="absolute right-6 top-6 rounded-full bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f6f3ee]">
            Outcome
          </div>
          <div className="space-y-6">
            <h2 className="font-[var(--font-space)] text-2xl font-semibold">
              Clear conversations
            </h2>
            <p className="font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
              When spam disappears, the group energy shifts. Admins focus on
              people, not cleanup.
            </p>
          </div>
          <div className="space-y-4 text-sm text-[#3c3c3c]">
            {outcomeItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-b border-[#e6e0d7] pb-4 font-[var(--font-plex)]"
              >
                <span className="h-2 w-2 rounded-full bg-[#161616]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
