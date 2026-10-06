'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Menu, Search, ScanLine } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { currentUser } from '@/lib/mock-data'

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { id: 1, title: 'Trần Minh Bình điểm danh trễ', time: '8 phút trước' },
    { id: 2, title: 'Camera 03 mất kết nối', time: '3 giờ trước' },
    { id: 3, title: '20 nhân viên chưa điểm danh hôm nay', time: '1 giờ trước' },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="Mở menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Tìm kiếm nhân viên, phòng ban..."
          className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Link
          href="/attendance"
          className="hidden items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
        >
          <ScanLine className="size-4" />
          Kiosk điểm danh
        </Link>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted"
            aria-label="Thông báo"
          >
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-1">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold">Thông báo</p>
                </div>
                <ul className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id} className="flex gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/50">
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm text-foreground">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-muted">
          <Avatar name={currentUser.name} className="size-8" />
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold leading-tight text-foreground">{currentUser.name}</p>
            <p className="text-xs leading-tight text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
