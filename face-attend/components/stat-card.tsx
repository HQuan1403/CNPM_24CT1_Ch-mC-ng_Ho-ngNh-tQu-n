import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'

const tones: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/18 text-[color:oklch(0.5_0.12_75)]',
  destructive: 'bg-destructive/12 text-destructive',
  neutral: 'bg-muted text-muted-foreground',
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  trend,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: keyof typeof tones
  trend?: { value: string; up?: boolean }
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {trend && (
            <p className={cn('mt-1.5 text-xs font-medium', trend.up ? 'text-success' : 'text-destructive')}>
              {trend.up ? '▲' : '▼'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="size-5.5" />
        </div>
      </div>
    </Card>
  )
}
