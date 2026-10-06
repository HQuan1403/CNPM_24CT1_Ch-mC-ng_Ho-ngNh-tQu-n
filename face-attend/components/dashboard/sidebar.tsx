'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { navItems } from './nav-items'
import { Logo } from './logo'
import { Avatar } from '@/components/ui/avatar'
import { currentUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

function isActive(pathname: string, href: string, match?: string[]) {
  if (pathname === href) return true
  const prefixes = match ?? [href]
  return prefixes.some((p) => pathname.startsWith(p + '/') || pathname === p)
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-16 items-center px-5">
        <Link href="/dashboard" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.match)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className={cn('size-4.5', active ? 'text-primary' : 'text-muted-foreground')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 rounded-lg bg-accent/40 px-3 py-2">
          <p className="text-xs text-muted-foreground">Công ty</p>
          <p className="text-sm font-semibold text-foreground">{currentUser.company}</p>
        </div>
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar name={currentUser.name} className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{currentUser.name}</p>
            <p className="truncate text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
          <Link
            href="/login"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            aria-label="Đăng xuất"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
