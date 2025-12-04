import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { getUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "ShadowMaster - Shadowrun VTT",
  description: "Virtual Tabletop for Shadowrun",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="en">
      <body>
        <AppLayout user={user}>{children}</AppLayout>
      </body>
    </html>
  );
}

