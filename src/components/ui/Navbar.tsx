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
        'w-full h-16 flex items-center justify-between px-6',
        'bg-background text-foreground',
        'border-b border-accent/20',
        className,
      )}
    >
      <Link
        href="/"
        className={cn(
          'text-lg font-semibold',
          'hover:text-primary transition-colors',
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
        <DropdownMenuContent align="end" />
      </DropdownMenu>
    </nav>
  )
}

export default Navbar
