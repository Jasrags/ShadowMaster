"use client";

import Link from "next/link";
import { buttonStyles, type VariantProps } from "./button";
import { twMerge } from "tailwind-merge";

interface LinkButtonProps
  extends React.ComponentPropsWithoutRef<typeof Link>,
    VariantProps<typeof buttonStyles> {
  children: React.ReactNode;
}

/**
 * LinkButton - A link that looks like a button
 * Use this in server components where you need button styling but link navigation
 */
export function LinkButton({
  href,
  children,
  className,
  intent,
  size,
  isCircle,
  ...linkProps
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={twMerge(
        buttonStyles({
          intent,
          size,
          isCircle,
        }),
        className
      )}
      {...linkProps}
    >
      {children}
    </Link>
  );
}
