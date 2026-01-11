"use client";

export default function HomeFinalCta() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pb-28 sm:px-10 lg:px-16">
      <div className="rounded-[48px] border border-[#161616] bg-[#161616] px-8 py-12 text-[#f6f3ee]">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#b9b1a7]">
              Final Call
            </p>
            <h2 className="font-[var(--font-space)] text-3xl font-semibold">
              Protect your WhatsApp group in minutes.
            </h2>
            <p className="font-[var(--font-plex)] text-base leading-7 text-[#c9c0b5]">
              No complex setup. No constant moderation. Just a calmer WhatsApp
              experience for everyone.
            </p>
          </div>
          <div className="flex flex-col items-start justify-center gap-4">
            <a
              href="/sign-up"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#f7b787] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#161616] transition hover:translate-y-[-2px] hover:shadow-[var(--shadow-soft)]"
            >
              Start Free
            </a>
            <a
              href="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#f6f3ee] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#f6f3ee] transition hover:bg-[#f6f3ee] hover:text-[#161616]"
            >
              View Dashboard Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
