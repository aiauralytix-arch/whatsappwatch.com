"use client";

const stories = [
  {
    title: "The flood of promo links",
    problem:
      "Daily spam links drowned out legitimate questions in a 400-person group.",
    solution: "WhatsApp Watch quietly removed every link and phone number.",
    result: "Engagement returned and admins stopped chasing messages.",
  },
  {
    title: "Admin fatigue",
    problem: "Volunteer moderators were deleting spam manually each morning.",
    solution: "Rules were set once and moderation ran silently.",
    result: "Admins now focus on welcoming new members instead of cleanup.",
  },
  {
    title: "Off-topic storms",
    problem: "Recurring keywords triggered noise and derailed threads.",
    solution: "Keyword blocking filtered the noise before it spread.",
    result: "Conversations stay on topic and feel calmer day to day.",
  },
];

export default function StoriesGrid() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">
      <div className="grid gap-6 rounded-[40px] border border-[#cfc7bc] bg-[#fefcf9] px-8 py-12 shadow-[var(--shadow-soft)] lg:grid-cols-3">
        {stories.map((story) => (
          <div
            key={story.title}
            className="rounded-3xl border border-[#e2dad0] bg-white p-6"
            style={{ animation: "fadeUp 0.8s ease both" }}
          >
            <p className="font-[var(--font-space)] text-lg font-semibold">
              {story.title}
            </p>
            <div className="mt-4 space-y-3 text-sm text-[#4b4b4b]">
              <p>
                <span className="font-semibold text-[#161616]">Problem:</span>{" "}
                {story.problem}
              </p>
              <p>
                <span className="font-semibold text-[#161616]">Solution:</span>{" "}
                {story.solution}
              </p>
              <p>
                <span className="font-semibold text-[#161616]">Result:</span>{" "}
                {story.result}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
