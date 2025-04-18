'use client'

import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu'

interface NavbarProps {
  className?: string
}

function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={cn(
        'flex h-16 w-full items-center justify-between px-6',
        'bg-background text-foreground',
        'border-accent/20 border-b',
        className
      )}
    >
      <Link
        href="/"
        className={cn(
          'text-lg font-semibold',
          'hover:text-primary transition-colors'
        )}
      >
        Tardis
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle menu">
            <Menu className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link
            href="/design-system"
            className="hover:bg-accent flex w-full items-center p-2"
          >
            Design System
          </Link>
          <Link
            href="/about"
            className="hover:bg-accent flex w-full items-center p-2"
          >
            About
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default Navbar
