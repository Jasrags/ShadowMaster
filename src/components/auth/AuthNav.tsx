import { getUser } from '@/lib/auth/session'
import { UserMenu } from './UserMenu'

export async function AuthNav() {
  const user = await getUser()

  if (!user) {
    return (
      <nav className="flex items-center gap-4">
        <a
          href="/login"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign In
        </a>
        <a
          href="/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </a>
      </nav>
    )
  }

  return <UserMenu user={user} />
}

