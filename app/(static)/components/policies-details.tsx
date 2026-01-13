"use client";

const policySections = [
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
      "We store group metadata, moderation toggles, blocked keywords, allowlists, and deleted message logs.",
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
];

export default function PoliciesDetails() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10 lg:px-16">
      <div className="grid gap-8 rounded-[40px] border border-[#cfc7bc] bg-[#fefcf9] px-8 py-12 shadow-[var(--shadow-soft)]">
        {policySections.map((section) => (
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
  );
}
