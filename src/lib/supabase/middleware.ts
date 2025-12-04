import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database'

/**
 * Creates a Supabase client for middleware
 * Handles session refresh and cookie management
 */
export function createClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    )
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }))
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options as CookieOptions)
        })
      },
    },
  })

  return { supabase, response }
}

/**
 * Checks if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/campaigns', '/characters', '/play']
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

/**
 * Checks if a route is a public auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/signup'
}

