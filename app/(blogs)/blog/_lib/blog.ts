import HowToRemoveSpamFromWhatsAppGroups, {
  post as howToRemoveSpamFromWhatsAppGroups,
} from "../../content/blog/how-to-remove-spam-from-whatsapp-groups.mdx";
import WhatsAppGroupAdminChecklist, {
  post as whatsAppGroupAdminChecklist,
} from "../../content/blog/whatsapp-group-admin-checklist.mdx";

import type { ComponentType } from "react";

export type BlogPostMetadata = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  author: string;
  readingTime: string;
};

export type BlogPost = BlogPostMetadata & {
  Content: ComponentType;
};

const posts: BlogPost[] = [
  {
    ...whatsAppGroupAdminChecklist,
    Content: WhatsAppGroupAdminChecklist,
  },
  {
    ...howToRemoveSpamFromWhatsAppGroups,
    Content: HowToRemoveSpamFromWhatsAppGroups,
  },
];

export function getAllBlogPosts() {
  return [...posts].sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() -
      new Date(first.publishedAt).getTime(),
  );
}

export function getBlogPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
