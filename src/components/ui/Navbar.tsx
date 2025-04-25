import { signInWithGoogle, signOutAction } from '@/actions/auth'
import { cn } from '@/lib/utils'
import { LogIn, LogOut, Menu } from 'lucide-react'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { Button } from './button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

interface NavbarProps {
  className?: string
  session: Session | null
}

// Helper components for Login/Logout actions using Server Actions
function SignInButton() {
  return (
    <form action={signInWithGoogle} className="w-full">
      <Button
        type="submit"
        variant="ghost"
        className="flex w-full items-center justify-start p-2"
      >
        <LogIn className="mr-2 size-4" />
        Sign In with Google
      </Button>
    </form>
  )
}

function SignOutButton() {
  return (
    <form action={signOutAction} className="w-full">
      <Button
        type="submit"
        variant="ghost"
        className="text-destructive hover:text-destructive flex w-full items-center justify-start p-2"
      >
        <LogOut className="mr-2 size-4" />
        Sign Out
      </Button>
    </form>
  )
}

function Navbar({ className, session }: NavbarProps) {
  const user = session?.user

  return (
    <nav
      className={cn(
        'flex h-16 w-full items-center justify-between px-6',
        'bg-background text-foreground',
        'border-accent/20 border-b',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className={cn(
            'text-lg font-semibold',
            'hover:text-primary transition-colors'
          )}
        >
          Tardis
        </Link>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle menu">
            <Menu className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link
              href="/design-system"
              className="flex w-full items-center p-2"
            >
              Design System
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/about" className="flex w-full items-center p-2">
              About
            </Link>
          </DropdownMenuItem>
          {user && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex w-full items-center p-2">
                Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {user ? <SignOutButton /> : <SignInButton />}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

export default Navbar
