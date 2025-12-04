import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { checkSession } from '@/lib/auth/session'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage() {
  const isAuthenticated = await checkSession()

  if (isAuthenticated) {
    redirect('/')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your ShadowMaster account
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <a
          href="/signup"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign up
        </a>
      </div>
    </div>
  )
}

