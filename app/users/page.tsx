import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/middleware";
import { getAllUsers } from "@/lib/storage/users";
import UserTable from "./UserTable";
import AuthenticatedLayout from "./AuthenticatedLayout";
import type { PublicUser } from "@/lib/types/user";

export default async function UsersPage() {
  try {
    // Require administrator role
    await requireAdmin();

    // Fetch initial user list
    const allUsers = await getAllUsers();
    const publicUsers: PublicUser[] = allUsers.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      characters: user.characters,
    }));

    return (
      <AuthenticatedLayout currentPath="/users">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
            User Management
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <UserTable initialUsers={publicUsers} />
      </AuthenticatedLayout>
    );
  } catch (error) {
    // Redirect to home if not admin or not authenticated
    redirect("/");
  }
}

