"use client";

const lensItems = [
  "Automatic message scanning",
  "Instant deletion of spam, links, and numbers",
  "Keyword rules tuned to your community",
];

export default function SystemHero() {
  return (
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
            System
          </p>
          <h1 className="font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            A quiet moderation system that stays out of the way.
          </h1>
          <p className="max-w-xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
            WhatsApp Watch blends automatic scanning, calm rule-setting, and
            subtle analytics so your group stays clear without daily effort.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/sign-up"
              className="rounded-full bg-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#f6f3ee] transition hover:translate-y-[-2px] hover:shadow-[var(--shadow-soft)]"
            >
              Start Protecting My Group
            </a>
            <a
              href="/contact"
              className="rounded-full border border-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] transition hover:bg-[#161616] hover:text-[#f6f3ee]"
            >
              Ask a Question
            </a>
          </div>
        </div>
        <div className="relative flex flex-col justify-between rounded-3xl border border-[#d5cec3] bg-white/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="absolute right-6 top-6 rounded-full bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f6f3ee]">
            System Lens
          </div>
          <div className="space-y-6">
            <h2 className="font-[var(--font-space)] text-2xl font-semibold">
              Always on, <br /> never noisy
            </h2>
            <p className="font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
              A calm layer of protection that quietly scans, removes, and
              reports what matters.
            </p>
          </div>
          <div className="space-y-4 text-sm text-[#3c3c3c]">
            {lensItems.map((item) => (
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
