import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2
        className="mt-12 font-[var(--font-space)] text-3xl font-semibold leading-tight text-[#161616]"
        {...props}
      />
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => (
      <p className="mt-5 font-[var(--font-plex)] text-base leading-8" {...props} />
    ),
    ul: (props: ComponentPropsWithoutRef<"ul">) => (
      <ul
        className="mt-5 list-disc space-y-2 pl-6 font-[var(--font-plex)]"
        {...props}
      />
    ),
    li: (props: ComponentPropsWithoutRef<"li">) => (
      <li className="pl-1 leading-8" {...props} />
    ),
    a: (props: ComponentPropsWithoutRef<"a">) => (
      <a className="font-semibold text-[#161616] underline" {...props} />
    ),
    ...components,
  };
}
