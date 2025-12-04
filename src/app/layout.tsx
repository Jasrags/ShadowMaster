import type { Metadata } from "next";
import "./globals.css";
import { AuthNav } from "@/components/auth/AuthNav";
import { checkSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "ShadowMaster - Shadowrun VTT",
  description: "Virtual Tabletop for Shadowrun",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthenticated = await checkSession();

  return (
    <html lang="en">
      <body>
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                  ShadowMaster
                </a>
              </div>
              <AuthNav />
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

