import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "/process", label: "Process" },
  { href: "/system", label: "System" },
  { href: "/stories", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#161616]">
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#f7b787] opacity-60 blur-3xl" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-[#8cc7c0] opacity-60 blur-3xl" />
          <div className="absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.08),transparent_65%)]" />
          <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(90deg,transparent_0px,transparent_34px,rgba(0,0,0,0.05)_35px)] opacity-30" />
        </div>

        <section className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-20 pt-12 sm:px-10 lg:px-16">
          <nav className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-[#3a3a3a]">
            <Link
              href="/"
              className="font-[var(--font-space)] text-base font-semibold tracking-[0.35em]"
            >
              WHATSAPP WATCH
            </Link>
            <div className="hidden items-center gap-8 font-[var(--font-plex)] text-xs sm:flex">
              {navItems.map((item) => (
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
              <Link
                href="/sign-in"
                className="hidden rounded-full border border-transparent px-3 py-2 font-[var(--font-plex)] text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:border-[#161616] hover:text-[#161616] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="hidden rounded-full border border-transparent px-3 py-2 font-[var(--font-plex)] text-[10px] uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:border-[#161616] hover:text-[#161616] sm:inline-flex"
              >
                Sign up
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-[#161616] px-4 py-2 font-[var(--font-plex)] text-xs tracking-[0.2em] transition hover:bg-[#161616] hover:text-[#f6f3ee]"
              >
                Book Signal
              </Link>
            </div>
          </nav>

          {children}
        </section>
      </main>
    </div>
  );
}
