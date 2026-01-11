"use client";

const features = [
  {
    title: "Automatic message scanning",
    description: "Every post is checked quietly before it disrupts the group.",
  },
  {
    title: "Spam, link, and phone removal",
    description:
      "Rules remove the most common noise without needing admin review.",
  },
  {
    title: "Keyword blocking",
    description: "Add words that should never appear in the thread again.",
  },
  {
    title: "Simple analytics overview",
    description:
      "A calm snapshot of what was scanned, removed, and resolved.",
  },
];

export default function SystemFeatures() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">
      <div className="grid gap-10 rounded-[40px] border border-[#cfc7bc] bg-[#fefcf9] px-8 py-12 shadow-[var(--shadow-soft)] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
            Core features
          </p>
          <h2 className="font-[var(--font-space)] text-3xl font-semibold">
            Moderation that feels automatic, not intrusive.
          </h2>
          <p className="font-[var(--font-plex)] text-base leading-7 text-[#4b4b4b]">
            Keep conversations clear while the system runs in the background.
            Every feature is designed to feel subtle and calm.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-[#e2dad0] bg-white p-6"
              style={{ animation: "fadeUp 0.8s ease both" }}
            >
              <p className="font-[var(--font-space)] text-lg font-semibold">
                {card.title}
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
