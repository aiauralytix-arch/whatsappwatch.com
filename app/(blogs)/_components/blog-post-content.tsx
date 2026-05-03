import type { ReactNode } from "react";

export function BlogPostContent({ children }: { children: ReactNode }) {
  return (
    <article className="mx-auto mt-14 max-w-3xl rounded-[40px] border border-[#cfc7bc] bg-[#fefcf9] px-6 py-10 shadow-[var(--shadow-soft)] sm:px-10 lg:px-14">
      <div className="font-[var(--font-plex)] text-base leading-8 text-[#3f3f3f] [&_a]:font-semibold [&_a]:text-[#161616] [&_a]:underline [&_h2]:mt-12 [&_h2]:font-[var(--font-space)] [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:text-[#161616] [&_h2:first-child]:mt-0 [&_li]:pl-1 [&_li]:leading-8 [&_p]:mt-5 [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}
