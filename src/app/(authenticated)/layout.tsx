'use client'

import { DynamicBreadcrumb } from '@/components/ui/DynamicBreadcrumb'
import {
  AppSidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useSession } from 'next-auth/react' // Import useSession
import { ReactNode } from 'react'

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  // Use the useSession hook
  const { data: session, status } = useSession()

  // Handle loading state
  if (status === 'loading') {
    // Optional: Render a skeleton loader or null while session is loading
    // This prevents rendering the layout before session status is known
    return null // Or <YourSkeletonLayout />
  }

  // Handle unauthenticated state (although middleware should prevent this)
  if (status === 'unauthenticated') {
    // This case should ideally not be reached due to middleware redirect.
    // Log a warning if it does.
    console.warn(
      '[AuthenticatedLayout] Unauthenticated status reached client-side. Middleware might not be configured correctly or session expired.'
    )
    // Optionally redirect using useRouter, though middleware is preferred.
    // Or return null / a message.
    return null
  }

  // Render the layout once authenticated
  return (
    <SidebarProvider>
      {' '}
      {/* Wrap with SidebarProvider */}
      <>
        {/* Pass session to the AppSidebar component */}
        {/* Ensure session object structure matches AppSidebar's expectation */}
        <AppSidebar session={session} />
        <SidebarRail />
        <SidebarInset>
          {/* Header */}
          <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
            {/* Mobile Sidebar Trigger - Show only on small screens */}
            <SidebarTrigger className="sm:hidden" /> {/* Use SidebarTrigger */}
            <DynamicBreadcrumb />
            {/* Other header elements like search or user menu can go here */}
          </header>
          {/* Main content area */}
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </SidebarInset>
      </>
    </SidebarProvider>
  )
}
