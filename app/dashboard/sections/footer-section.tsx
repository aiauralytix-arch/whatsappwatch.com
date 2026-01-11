"use client";

type FooterSectionProps = {
  isSyncing: boolean;
};

export default function FooterSection({ isSyncing }: FooterSectionProps) {
  return (
    <footer className="text-center text-xs uppercase tracking-[0.2em] text-[#9a948b]">
      {isSyncing
        ? "Syncing changes..."
        : "Moderation actions are automated. Review WhatsApp policies."}
    </footer>
  );
}
