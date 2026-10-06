'use client'

import { cn } from '@/lib/utils'

function Switch({
  checked,
  onChange,
  ...props
}: {
  checked: boolean
  onChange: (checked: boolean) => void
} & Omit<React.ComponentProps<'button'>, 'onChange'>) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none',
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-block size-5 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

export { Switch }
