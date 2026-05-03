declare module "*.mdx" {
  import type { ComponentType } from "react";

  export const post: {
    title: string;
    slug: string;
    description: string;
    publishedAt: string;
    author: string;
    readingTime: string;
  };

  const MDXComponent: ComponentType;
  export default MDXComponent;
}
