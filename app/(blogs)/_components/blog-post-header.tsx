import Link from "next/link";
import { BlogPostMetadata } from "../blog/_lib/blog";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function BlogPostHeader({ post }: { post: BlogPostMetadata }) {
  return (
    <header className="mx-auto mt-20 max-w-3xl text-center">
      <Link
        href="/blog"
        className="font-[var(--font-plex)] text-xs uppercase tracking-[0.35em] text-[#6b6b6b] transition hover:text-[#161616]"
      >
        Blog
      </Link>
      <h1 className="mt-6 font-[var(--font-space)] text-4xl font-semibold leading-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl font-[var(--font-plex)] text-lg leading-8 text-[#474747]">
        {post.description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-[var(--font-plex)] text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">
        <span>{post.author}</span>
        <span className="h-1 w-1 rounded-full bg-[#6b6b6b]" />
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span className="h-1 w-1 rounded-full bg-[#6b6b6b]" />
        <span>{post.readingTime}</span>
      </div>
    </header>
  );
}
