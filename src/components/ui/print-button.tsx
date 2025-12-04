"use client";

import { Button } from "./button";

interface PrintButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PrintButton - A button that triggers the browser print dialog
 */
export function PrintButton({ children, className, ...props }: PrintButtonProps & React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={className}
      onPress={() => {
        if (typeof window !== "undefined") {
          window.print();
        }
      }}
    >
      {children}
    </Button>
  );
}

