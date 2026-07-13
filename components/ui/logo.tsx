import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> {
  size?: number;
}

export function Logo({ size = 24, className, ...props }: LogoProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0",
        className,
      )}
      {...props}
    >
      <Image
        src="/logo.svg"
        alt="Open Poll Logo"
        width={size}
        height={size}
        priority
      />
    </div>
  );
}
