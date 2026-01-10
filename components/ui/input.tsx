import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-full border border-[#d5cec3] bg-white px-4 text-sm text-[#161616] placeholder:text-[#9a948b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#161616]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
