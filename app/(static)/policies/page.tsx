"use client"

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#161616]">
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

        <section className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-14 pt-12 sm:px-10 lg:px-16">
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

          <div className="mt-24 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-10">
              <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
                Policies
              </p>
              <h1 className="font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Clear terms. Quiet rules.
              </h1>
              <p className="max-w-xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
                Clear, direct rules about service scope and refunds. These
                points are meant to be easy to read and easy to apply.
              </p>
              <div className="grid max-w-xl grid-cols-1 gap-4 border-t border-[#cfc7bc] pt-6 text-sm text-[#4b4b4b] sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e2dad0] bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                    Applies to
                  </p>
                  <p className="mt-2 font-[var(--font-plex)]">
                    Website + moderation dashboard
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e2dad0] bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                    Last updated
                  </p>
                  <p className="mt-2 font-[var(--font-plex)]">
                    11 Jan 2026
                  </p>
                </div>
              </div>
            </div>
            <div className="relative flex flex-col justify-between rounded-3xl border border-[#d5cec3] bg-white/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
              <div className="absolute right-6 top-6 rounded-full bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f6f3ee]">
                Summary
              </div>
              <div className="space-y-6">
                <h2 className="font-[var(--font-space)] text-2xl font-semibold">
                  What to expect
                </h2>
                <p className="font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
                  Your dashboard stores the rules you configure. Moderation
                  execution happens through connected systems outside this site.
                </p>
              </div>
              <div className="space-y-4 text-sm text-[#3c3c3c]">
                {[
                  "Scope: delete spam messages only",
                  "No spammer bans or account action",
                  "Refunds apply only to the current month if service fails",
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
          <div className="grid gap-8 rounded-[40px] border border-[#cfc7bc] bg-[#fefcf9] px-8 py-12 shadow-[var(--shadow-soft)]">
            {[
              {
                title: "Service scope",
                items: [
                  "We only delete spam messages in WhatsApp groups.",
                  "We do not ban spammers or take action on user accounts.",
                  "We do not promise 100% spam removal in every case.",
                ],
              },
              {
                title: "Refunds for service failure",
                items: [
                  "If service delivery fails for 5 continuous days, you can request a refund.",
                  "Refunds apply only to the current month charges.",
                  "Example: if failure runs from 28 Jan to 2 Feb, only January charges are refunded.",
                  "Refunds are processed within 7 business days after we review configuration and logs.",
                ],
              },
              {
                title: "Account access",
                items: [
                  "Authentication is handled through a third-party provider.",
                  "You are responsible for access and actions taken from your account.",
                ],
              },
              {
                title: "Data stored",
                items: [
                  "We store group metadata, moderation toggles, blocked keywords, and admin allowlists.",
                  "Only add data that you are authorized to manage.",
                ],
              },
              {
                title: "Acceptable use",
                items: [
                  "Do not use the service to target, harass, or disrupt communities.",
                  "Follow WhatsApp policies and local regulations.",
                ],
              },
              {
                title: "Policy changes",
                items: [
                  "We may update these policies as the service evolves.",
                  "Check this page for the most current details.",
                ],
              },
              {
                title: "Questions",
                items: [
                  "Reach us at support@whatsappwatch.com for clarifications or requests.",
                ],
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-3xl border border-[#e2dad0] bg-white p-6"
              >
                <h3 className="font-[var(--font-space)] text-xl font-semibold text-[#161616]">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2 font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#161616]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
