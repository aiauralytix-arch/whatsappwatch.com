"use client"

export default function Home() {
  return (
    <div
      className={`bg-[#f6f3ee] text-[#161616] min-h-screen`}
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
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
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
                Quiet automation for WhatsApp communities
              </p>
              <h1 className="font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Keep your groups clean, calm, and spam free
                automatically.
              </h1>
              <p className="max-w-xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
                WhatsApp Watch creates calm moderation systems that work quietly,
                removing spam and distractions while keeping conversations
                clear, focused, and uninterrupted.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/sign-up"
                  className="rounded-full bg-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#f6f3ee] transition hover:translate-y-[-2px] hover:shadow-[var(--shadow-soft)]"
                >
                  Start Protecting My Group
                </a>
                <a
                  href="/process"
                  className="rounded-full border border-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] transition hover:bg-[#161616] hover:text-[#f6f3ee]"
                >
                  See How It Works
                </a>
              </div>
              <div className="grid max-w-xl grid-cols-3 gap-4 border-t border-[#cfc7bc] pt-6 text-center font-[var(--font-plex)] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                <div>
                  <div className="font-[var(--font-space)] text-2xl text-[#161616]">
                    Instant
                  </div>
                  Setup
                </div>
                <div>
                  <div className="font-[var(--font-space)] text-2xl text-[#161616]">
                    Auto
                  </div>
                  Delete Spam
                </div>
                <div>
                  <div className="font-[var(--font-space)] text-2xl text-[#161616]">
                    Zero
                  </div>
                  Manual Moderation
                </div>
              </div>
            </div>
            <div className="relative flex flex-col justify-between rounded-3xl border border-[#d5cec3] bg-white/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="absolute right-6 top-6 rounded-full bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f6f3ee]">
                Live System
              </div>
              <div className="space-y-6">
                <h2 className="font-[var(--font-space)] text-2xl font-semibold">
                  The Quiet Stack
                </h2>
                <p className="font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
                  A single dashboard showing what was scanned, what was removed,
                  and how your group stays protected — without constant oversight.
                </p>
              </div>
              <div className="space-y-4 text-sm text-[#3c3c3c]">
                {[
                  "Automatic message scanning in real time",
                  "Smart deletion of spam, links, and numbers",
                  "Simple rules you control, once",
                ].map((item) => (
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

        <section className="relative mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">
          <div className="grid gap-10 rounded-[40px] border border-[#cfc7bc] bg-[#fefcf9] px-8 py-12 shadow-[var(--shadow-soft)] lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-6">
              <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
                How it works
              </p>
              <h2 className="font-[var(--font-space)] text-3xl font-semibold">
                Three steps. One calm system.
              </h2>
              <p className="font-[var(--font-plex)] text-base leading-7 text-[#4b4b4b]">
                WhatsApp Watch is designed to be set up once and trusted daily.
                No dashboards to babysit. No constant tuning. Just clear rules
                and quiet automation.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Clarity Grid",
                  description:
                    "A structured map of priorities, outcomes, and the people who own them.",
                },
                {
                  title: "Rhythm Engine",
                  description:
                    "Weekly rituals that stabilize momentum without exhausting teams.",
                },
                {
                  title: "Signal Rooms",
                  description:
                    "Dashboards that read like briefs, built for instant comprehension.",
                },
                {
                  title: "System Design",
                  description:
                    "The operating model that keeps growth decisive and effortless.",
                },
              ].map((card, index) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-[#e2dad0] bg-white p-6"
                  style={{ animation: "fadeUp 0.8s ease both" }}
                >
                  <p className="font-[var(--font-space)] text-lg font-semibold">
                    {`0${index + 1}. ${card.title}`}
                  </p>
                  <p className="mt-3 font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[36px] border border-[#cfc7bc] bg-[#161616] p-8 text-[#f6f3ee]">
              <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#b9b1a7]">
                The Journey
              </p>
              <h2 className="mt-4 font-[var(--font-space)] text-3xl font-semibold">
                From chaos to clean conversation.
              </h2>
              <div className="mt-8 space-y-6 font-[var(--font-plex)] text-sm text-[#c9c0b5]">
                {[
                  "Group messages are scanned automatically",
                  "Spam and promotions are removed instantly",
                  "Real conversations stay uninterrupted",
                  "You stay focused on your community",
                ].map((step) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 border-b border-[#2a2a2a] pb-5"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#f7b787]" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[36px] border border-[#cfc7bc] bg-[#fefcf9] p-8">
              <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
                Proof
              </p>
              <h3 className="mt-4 font-[var(--font-space)] text-2xl font-semibold">
                ““We stopped worrying about spam completely.””
              </h3>
              <p className="mt-6 font-[var(--font-plex)] text-sm leading-7 text-[#4b4b4b]">
                Our WhatsApp group finally feels usable again. No promo links,
                no random numbers, no constant admin cleanup. It just works.
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-[#e2dad0] pt-6 text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                <span>Operations Director</span>
                <span>Global Mobility Lab</span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">
          <div className="grid gap-8 rounded-[40px] border border-[#cfc7bc] bg-[#fefcf9] px-8 py-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
                Plans
              </p>
              <h2 className="font-[var(--font-space)] text-3xl font-semibold">
                One page, one system, complete alignment.
              </h2>
              <p className="font-[var(--font-plex)] text-base leading-7 text-[#4b4b4b]">
                Choose the engagement that matches your pace. Every plan
                delivers a single cohesive operating canvas.
              </p>
              <a
                href="/contact"
                className="inline-flex w-fit rounded-full bg-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#f6f3ee] transition hover:translate-y-[-2px] hover:shadow-[var(--shadow-soft)]"
              >
                Reserve a Slot
              </a>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "Signal Sprint",
                  price: "12k",
                  detail: "Two-week diagnostic + signal board.",
                },
                {
                  title: "System Atelier",
                  price: "36k",
                  detail: "Full operating system with rituals + rollout.",
                },
              ].map((plan) => (
                <div
                  key={plan.title}
                  className="rounded-3xl border border-[#e2dad0] bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-[var(--font-space)] text-xl font-semibold">
                      {plan.title}
                    </h3>
                    <span className="font-[var(--font-plex)] text-sm uppercase tracking-[0.2em] text-[#6b6b6b]">
                      {plan.price}
                    </span>
                  </div>
                  <p className="mt-3 font-[var(--font-plex)] text-sm text-[#4b4b4b]">
                    {plan.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

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
                  No complex setup. No constant moderation.
                  Just a calmer WhatsApp experience for everyone.
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

      </main>
    </div>
  );
}
