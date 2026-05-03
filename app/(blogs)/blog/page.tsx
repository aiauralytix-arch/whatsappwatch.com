import { BlogCard } from "../_components/blog-card";
import { BlogShell } from "../_components/blog-shell";
import { getAllBlogPosts } from "./_lib/blog";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <BlogShell>
      <div className="mt-24 grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-10">
          <p className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b]">
            Blog
          </p>
          <h1 className="font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Practical notes for calmer WhatsApp groups.
          </h1>
          <p className="max-w-xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
            Guides for admins who want less spam, fewer distractions, and a
            cleaner group without turning moderation into a full-time job.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-full bg-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] text-[#f6f3ee] transition hover:translate-y-[-2px] hover:shadow-[var(--shadow-soft)]"
            >
              Start Protecting My Group
            </Link>
            <Link
              href="/process"
              className="rounded-full border border-[#161616] px-6 py-3 font-[var(--font-plex)] text-sm uppercase tracking-[0.25em] transition hover:bg-[#161616] hover:text-[#f6f3ee]"
            >
              See How It Works
            </Link>
          </div>
        </div>

        <div className="relative flex flex-col justify-between rounded-3xl border border-[#d5cec3] bg-white/70 p-8 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="absolute right-6 top-6 rounded-full bg-[#161616] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f6f3ee]">
            Admin Notes
          </div>
          <div className="space-y-6">
            <h2 className="w-[60%] font-[var(--font-space)] text-2xl font-semibold">
              Cleaner groups start with clear rules.
            </h2>
            <p className="font-[var(--font-plex)] text-sm leading-6 text-[#4b4b4b]">
              Each guide focuses on one practical moderation problem and the
              quiet systems that keep it from taking over your group.
            </p>
          </div>
          <div className="space-y-4 text-sm text-[#3c3c3c]">
            {[
              "Spot the repeat patterns",
              "Set rules once",
              "Let cleanup run quietly",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-b border-[#e6e0d7] pb-4 font-[var(--font-plex)]"
              >
                <span className="h-2 w-2 rounded-full bg-[#161616]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-16 grid gap-6 pb-12 lg:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </section>
    </BlogShell>
  );
}
