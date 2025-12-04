import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShadowMaster - Shadowrun VTT",
  description: "Virtual Tabletop for Shadowrun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

