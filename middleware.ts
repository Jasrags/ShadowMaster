import { type NextRequest, NextResponse } from 'next/server'
import { createClient, isProtectedRoute, isAuthRoute } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files and favicon
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  const { supabase, response } = createClient(request)
  
  // Get session and validate user exists
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  // Validate the user actually exists (not just a session cookie)
  let isAuthenticated = false
  if (session) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    // Only consider authenticated if we have both session and valid user
    isAuthenticated = !error && user !== null
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && isAuthRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

