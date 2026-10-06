import { cn } from '@/lib/utils'

const palette = [
  'bg-[oklch(0.51_0.23_277)]',
  'bg-[oklch(0.6_0.19_150)]',
  'bg-[oklch(0.65_0.17_40)]',
  'bg-[oklch(0.6_0.19_300)]',
  'bg-[oklch(0.62_0.16_220)]',
  'bg-[oklch(0.62_0.17_10)]',
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function colorFor(name: string) {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return palette[sum % palette.length]
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white',
        colorFor(name),
        className,
      )}
      aria-hidden="true"
    >
      {initials(name)}
    </div>
  )
}

export { Avatar }
