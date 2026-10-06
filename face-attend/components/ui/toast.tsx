'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'info' | 'warning' | 'error'

type Toast = {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

type ToastContextValue = {
  toast: (t: { title: string; description?: string; variant?: ToastVariant }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const variantStyles: Record<ToastVariant, { icon: React.ReactNode; bar: string }> = {
  success: { icon: <CheckCircle2 className="size-5 text-success" />, bar: 'bg-success' },
  info: { icon: <Info className="size-5 text-primary" />, bar: 'bg-primary' },
  warning: { icon: <AlertTriangle className="size-5 text-warning" />, bar: 'bg-warning' },
  error: { icon: <AlertTriangle className="size-5 text-destructive" />, bar: 'bg-destructive' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    ({ title, description, variant = 'success' }: { title: string; description?: string; variant?: ToastVariant }) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, title, description, variant }])
      setTimeout(() => remove(id), 3500)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl border border-border bg-card p-3.5 shadow-lg animate-in slide-in-from-top-2 fade-in"
          >
            <span className={cn('absolute top-0 bottom-0 left-0 w-1', variantStyles[t.variant].bar)} />
            <div className="mt-0.5 shrink-0">{variantStyles[t.variant].icon}</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-card-foreground">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-muted-foreground">{t.description}</p>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Đóng thông báo"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
