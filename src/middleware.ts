import { authConfig } from '@/app/api/auth/[...nextauth]/route'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const isLoggedIn = !!session?.user

  const isProtectedRoute =
    nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname.startsWith('/accounting')

  if (isProtectedRoute) {
    if (isLoggedIn) {
      // Allow access if the user is logged in
      return undefined
    }
    // Redirect unauthenticated users to the homepage
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  // Allow all other requests
  return undefined
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (static assets in public folder)
     * - manifest.json (PWA manifest)
     * - sw.js (Service worker)
     * - icons/ (PWA icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|manifest.json|sw.js|icons/).*)',
  ],
}
