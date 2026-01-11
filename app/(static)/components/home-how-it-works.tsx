"use client";

const steps = [
  {
    title: "Clarity Grid",
    description:
      "A structured map of priorities, outcomes, and the people who own them.",
  },
  {
    title: "Rhythm Engine",
    description: "Weekly rituals that stabilize momentum without exhausting teams.",
  },
  {
    title: "Signal Rooms",
    description:
      "Dashboards that read like briefs, built for instant comprehension.",
  },
  {
    title: "System Design",
    description: "The operating model that keeps growth decisive and effortless.",
  },
];

export default function HomeHowItWorks() {
  return (
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
            WhatsApp Watch is designed to be set up once and trusted daily. No
            dashboards to babysit. No constant tuning. Just clear rules and
            quiet automation.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {steps.map((card, index) => (
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
  );
}
