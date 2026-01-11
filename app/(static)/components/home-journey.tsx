"use client";

const journeySteps = [
  "Group messages are scanned automatically",
  "Spam and promotions are removed instantly",
  "Real conversations stay uninterrupted",
  "You stay focused on your community",
];

export default function HomeJourney() {
  return (
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
            {journeySteps.map((step) => (
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
            Our WhatsApp group finally feels usable again. No promo links, no
            random numbers, no constant admin cleanup. It just works.
          </p>
          <div className="mt-8 flex items-center justify-between border-t border-[#e2dad0] pt-6 text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
            <span>Operations Director</span>
            <span>Global Mobility Lab</span>
          </div>
        </div>
      </div>
    </section>
  );
}
