import { Badge } from '@/components/ui/badge'
import type { AttendanceStatus } from '@/lib/mock-data'

const map: Record<AttendanceStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'neutral'; dot: string }> = {
  'on-time': { label: 'Đúng giờ', variant: 'success', dot: 'bg-success' },
  late: { label: 'Đi trễ', variant: 'warning', dot: 'bg-warning' },
  absent: { label: 'Vắng', variant: 'destructive', dot: 'bg-destructive' },
  'not-checked': { label: 'Chưa điểm danh', variant: 'neutral', dot: 'bg-muted-foreground' },
  'early-leave': { label: 'Về sớm', variant: 'warning', dot: 'bg-warning' },
}

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  const s = map[status]
  return (
    <Badge variant={s.variant}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </Badge>
  )
}
