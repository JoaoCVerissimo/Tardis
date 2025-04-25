'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

// Helper function to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean) // Split path and remove empty strings

  // Don't render breadcrumbs for root of the authenticated section or if no segments
  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0] === 'dashboard')
  ) {
    // Optionally render a single "Dashboard" item if on /dashboard
    if (segments.length === 1 && segments[0] === 'dashboard') {
      return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )
    }
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Always add Dashboard link first if not on dashboard */}
        {segments[0] !== 'dashboard' && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/')
          const isLast = index === segments.length - 1
          const label = capitalize(segment.replace(/-/g, ' ')) // Replace hyphens and capitalize

          // Skip rendering the 'Dashboard' segment again if it's the first one
          if (index === 0 && segment === 'dashboard') {
            return null
          }

          return (
            <Fragment key={href}>
              {/* Add separator if not the first item (or if dashboard wasn't the first) */}
              {(index > 0 || segments[0] !== 'dashboard') && (
                <BreadcrumbSeparator />
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
