'use server'

import { signIn, signOut } from '@/app/api/auth/[...nextauth]/route'

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}

export async function signInWithGoogle() {
  await signIn('google', { redirectTo: '/dashboard' })
}
