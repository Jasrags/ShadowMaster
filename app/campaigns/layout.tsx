"use client";

import AuthenticatedLayout from "@/app/users/AuthenticatedLayout";
import { usePathname } from "next/navigation";

export default function CampaignsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <AuthenticatedLayout currentPath={pathname}>
            {children}
        </AuthenticatedLayout>
    );
}
