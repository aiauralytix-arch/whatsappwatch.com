import type { ReactNode } from "react";
import SiteNav from "../../(static)/components/site-nav";

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
          <SiteNav />

          {children}
        </section>
      </main>
    </div>
  );
}
