import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-[#d5cec3] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#4b4b4b]",
  {
    variants: {
      variant: {
        default: "bg-[#fefcf9]",
        soft: "bg-[#efe9df]",
        dark: "border-[#161616] bg-[#161616] text-[#f6f3ee]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
