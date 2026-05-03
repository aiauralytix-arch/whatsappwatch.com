import Link from "next/link";
import { BlogPostMetadata } from "../blog/_lib/blog";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function BlogCard({ post }: { post: BlogPostMetadata }) {
  return (
    <article className="rounded-3xl border border-[#e2dad0] bg-white p-7 shadow-[var(--shadow-soft)] transition hover:-translate-y-1">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex flex-wrap items-center gap-3 font-[var(--font-plex)] text-[10px] uppercase tracking-[0.25em] text-[#6b6b6b]">
          <span>Guide</span>
          <span className="h-1 w-1 rounded-full bg-[#6b6b6b]" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="h-1 w-1 rounded-full bg-[#6b6b6b]" />
          <span>{post.readingTime}</span>
        </div>
        <h2 className="mt-5 font-[var(--font-space)] text-2xl font-semibold leading-tight text-[#161616]">
          {post.title}
        </h2>
        <p className="mt-4 font-[var(--font-plex)] text-base leading-7 text-[#4b4b4b]">
          {post.description}
        </p>
        <div className="mt-7 inline-flex rounded-full border border-[#161616] px-5 py-3 font-[var(--font-plex)] text-xs uppercase tracking-[0.25em] transition hover:bg-[#161616] hover:text-[#f6f3ee]">
          Read Guide
        </div>
      </Link>
    </article>
  );
}
