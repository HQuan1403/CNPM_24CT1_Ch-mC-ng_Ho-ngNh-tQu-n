import { ScanFace } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <ScanFace className="size-5" />
      </div>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Face<span className="text-primary">Attend</span>
        </span>
      )}
    </div>
  )
}
