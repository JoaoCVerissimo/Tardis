import type { NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Optional: Add callbacks, pages, etc. here if needed later
  // pages: {
  //   signIn: '/login', // Example: Custom sign-in page
  // },
  // callbacks: {
  //   authorized({ auth, request: { nextUrl } }) {
  //     const isLoggedIn = !!auth?.user
  //     const isOnAccountingPage = nextUrl.pathname.startsWith('/accounting')
  //
  //     if (isOnAccountingPage) {
  //       if (isLoggedIn) return true // Allow access if logged in
  //       return false // Redirect unauthenticated users to login page
  //     } else if (isLoggedIn) {
  //       // Optional: Redirect logged-in users from a public page like login if needed
  //       // return Response.redirect(new URL('/dashboard', nextUrl));
  //     }
  //     return true // Allow access for other pages
  //   },
  // },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const { GET, POST } = handlers
