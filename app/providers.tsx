"use client";

import { I18nProvider } from "react-aria-components";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/lib/contexts/SidebarContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider locale="en-US">
        <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
