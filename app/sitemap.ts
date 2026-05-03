import type { MetadataRoute } from "next";

import { getAllBlogPosts } from "./(blogs)/blog/_lib/blog";

const siteUrl = "https://whatsappwatch.com";

const staticRoutes = [
  {
    path: "/",
    priority: 1,
  },
  {
    path: "/process",
    priority: 0.8,
  },
  {
    path: "/system",
    priority: 0.8,
  },
  {
    path: "/stories",
    priority: 0.7,
  },
  {
    path: "/blog",
    priority: 0.8,
  },
  {
    path: "/contact",
    priority: 0.6,
  },
  {
    path: "/policies",
    priority: 0.4,
  },
] satisfies Array<{
  path: string;
  priority: number;
}>;

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route.priority,
  }));

  const posts = getAllBlogPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...posts];
}
