import { redirect } from 'next/navigation'
import { checkSession } from '@/lib/auth/session'
import { SignupForm } from '@/components/auth/SignupForm'

export default async function SignupPage() {
  const isAuthenticated = await checkSession()

  if (isAuthenticated) {
    redirect('/')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Create a new ShadowMaster account
        </p>
      </div>
      <SignupForm />
      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <a
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Sign in
        </a>
      </div>
    </div>
  )
}

