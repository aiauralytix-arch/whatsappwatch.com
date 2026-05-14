import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  items?: NavItem[];
  actions?: NavItem[];
  primaryAction?: NavItem;
};

const defaultItems: NavItem[] = [
  { href: "/process", label: "Process" },
  { href: "/system", label: "System" },
  { href: "/stories", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

const defaultActions: NavItem[] = [
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Sign up" },
];

const defaultPrimaryAction: NavItem = {
  href: "/dashboard",
  label: "Dashboard",
};

export default function SiteNav({
  items = defaultItems,
  actions = defaultActions,
  primaryAction = defaultPrimaryAction,
}: SiteNavProps) {
  return (
    <nav className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-[#3a3a3a]">
      <Link
        href="/"
        className="font-[var(--font-space)] text-base font-semibold tracking-[0.35em]"
      >
        WHATSAPP WATCH
      </Link>
      <div className="hidden items-center gap-8 font-[var(--font-plex)] text-xs sm:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            className="transition hover:text-[#161616]"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {actions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hidden rounded-full border border-transparent px-3 py-2 font-[var(--font-plex)] text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:border-[#161616] hover:text-[#161616] sm:inline-flex"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href={primaryAction.href}
          className="rounded-full border border-[#161616] px-4 py-2 font-[var(--font-plex)] text-xs tracking-[0.2em] transition hover:bg-[#161616] hover:text-[#f6f3ee]"
        >
          {primaryAction.label}
        </Link>
      </div>
    </nav>
  );
}
