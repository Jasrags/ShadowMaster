"use client";

import { I18nProvider } from "react-aria-components";
import { AuthProvider } from "@/lib/auth/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider locale="en-US">
      <AuthProvider>{children}</AuthProvider>
    </I18nProvider>
  );
}

