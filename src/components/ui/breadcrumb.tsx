"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component
 * 
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "Campaigns", href: "/campaigns" },
 *     { label: "My Campaign", href: "/campaigns/123" },
 *     { label: "Edit" },
 *   ]}
 * />
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={twMerge("flex items-center gap-2 text-sm text-muted-fg", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-muted-fg/50">
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-fg transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-fg" : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

interface BreadcrumbContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Simple breadcrumb container for custom breadcrumb layouts
 */
export function BreadcrumbContainer({ children, className }: BreadcrumbContainerProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={twMerge("flex items-center gap-2 text-sm text-muted-fg", className)}
    >
      {children}
    </nav>
  );
}

interface BreadcrumbLinkProps {
  href: string;
  children: React.ReactNode;
}

/**
 * Breadcrumb link component
 */
export function BreadcrumbLink({ href, children }: BreadcrumbLinkProps) {
  return (
    <Link href={href} className="hover:text-fg transition-colors">
      {children}
    </Link>
  );
}

interface BreadcrumbSeparatorProps {
  className?: string;
}

/**
 * Breadcrumb separator
 */
export function BreadcrumbSeparator({ className }: BreadcrumbSeparatorProps) {
  return (
    <span aria-hidden="true" className={twMerge("text-muted-fg/50", className)}>
      /
    </span>
  );
}

interface BreadcrumbCurrentProps {
  children: React.ReactNode;
}

/**
 * Current breadcrumb item (not a link)
 */
export function BreadcrumbCurrent({ children }: BreadcrumbCurrentProps) {
  return <span className="text-fg">{children}</span>;
}

