import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllBlogPosts, getBlogPost } from "../_lib/blog";
import { BlogShell } from "../../_components/blog-shell";
import { BlogPostContent } from "../../_components/blog-post-content";
import { BlogPostHeader } from "../../_components/blog-post-header";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | WhatsApp Watch`,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      siteName: "WhatsApp Watch",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const PostContent = post.Content;

  return (
    <BlogShell>
      <BlogPostHeader post={post} />
      <BlogPostContent>
        <PostContent />
      </BlogPostContent>
    </BlogShell>
  );
}
