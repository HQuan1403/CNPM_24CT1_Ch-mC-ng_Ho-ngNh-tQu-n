'use client'

import { cn } from '@/lib/utils'

/* -------- Line / Area chart (multi-series over days) -------- */
export function LineChart({
  labels,
  series,
  height = 220,
}: {
  labels: string[]
  series: { name: string; color: string; values: number[] }[]
  height?: number
}) {
  const width = 640
  const padX = 32
  const padY = 24
  const max = Math.max(...series.flatMap((s) => s.values)) * 1.15 || 1
  const stepX = (width - padX * 2) / (labels.length - 1)
  const y = (v: number) => height - padY - (v / max) * (height - padY * 2)
  const x = (i: number) => padX + i * stepX

  const linePath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ')
  const areaPath = (values: number[]) =>
    `${linePath(values)} L ${x(values.length - 1)} ${height - padY} L ${x(0)} ${height - padY} Z`

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-4">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} role="img" aria-label="Biểu đồ đường">
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={width - padX}
            y1={height - padY - t * (height - padY * 2)}
            y2={height - padY - t * (height - padY * 2)}
            stroke="currentColor"
            className="text-border"
            strokeDasharray="4 4"
          />
        ))}
        {series.map((s, si) => (
          <g key={s.name}>
            <defs>
              <linearGradient id={`grad-${si}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath(s.values)} fill={`url(#grad-${si})`} />
            <path d={linePath(s.values)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill={s.color} stroke="white" strokeWidth={1.5} />
            ))}
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={l} x={x(i)} y={height - 4} textAnchor="middle" className="fill-muted-foreground text-[11px]">
            {l}
          </text>
        ))}
      </svg>
    </div>
  )
}

/* -------- Vertical bar chart -------- */
export function BarChart({
  data,
  color = 'var(--color-primary)',
  height = 220,
}: {
  data: { label: string; value: number }[]
  color?: string
  height?: number
}) {
  const max = Math.max(...data.map((d) => d.value)) * 1.1 || 1
  return (
    <div className="flex w-full items-end gap-3" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="group relative w-full rounded-t-md transition-all"
              style={{ height: `${(d.value / max) * 100}%`, background: color, minHeight: 4 }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {d.value}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

/* -------- Grouped bars (two series) -------- */
export function GroupedBarChart({
  labels,
  series,
  height = 220,
}: {
  labels: string[]
  series: { name: string; color: string; values: number[] }[]
  height?: number
}) {
  const max = Math.max(...series.flatMap((s) => s.values)) * 1.1 || 1
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-4">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
      <div className="flex items-end gap-3" style={{ height }}>
        {labels.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end justify-center gap-1">
              {series.map((s) => (
                <div
                  key={s.name}
                  className="w-full max-w-4 rounded-t-md"
                  style={{ height: `${(s.values[i] / max) * 100}%`, background: s.color, minHeight: 3 }}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------- Horizontal bar list -------- */
export function HorizontalBars({
  data,
}: {
  data: { label: string; value: number; sub?: string; color?: string }[]
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className="flex flex-col gap-4">
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{d.label}</span>
            <span className="text-muted-foreground">{d.sub ?? `${d.value}%`}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color ?? 'var(--color-primary)' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* -------- Donut / gauge -------- */
export function Donut({
  value,
  label,
  size = 160,
  color = 'var(--color-primary)',
}: {
  value: number
  label?: string
  size?: number
  color?: string
}) {
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className={cn('relative inline-flex items-center justify-center')} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="text-muted" stroke="currentColor" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{value}%</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}
