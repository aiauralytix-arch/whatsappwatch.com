"use client";

const plans = [
  { title: "Signal Sprint", price: "12k", detail: "Two-week diagnostic + signal board." },
  { title: "System Atelier", price: "36k", detail: "Full operating system with rituals + rollout." },
];

export default function HomePlans() {
  return (
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
            Choose the engagement that matches your pace. Every plan delivers a
            single cohesive operating canvas.
          </p>
          <a
            href="/contact"
            className="inline-flex w-fit rounded-full bg-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#f6f3ee] transition hover:translate-y-[-2px] hover:shadow-[var(--shadow-soft)]"
          >
            Reserve a Slot
          </a>
        </div>
        <div className="grid gap-4">
          {plans.map((plan) => (
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
  );
}
