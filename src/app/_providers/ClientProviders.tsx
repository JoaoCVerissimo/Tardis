'use client'

import QueryProvider from '@/app/_providers/QueryProvider'
import { Theme } from '@/lib/weatherUtils'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'

export function ClientProviders({
  children,
  initialTheme,
}: {
  children: ReactNode
  initialTheme: Theme
}) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
