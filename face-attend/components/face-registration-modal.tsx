'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, X, CheckCircle2, Loader2, ScanFace } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

type Phase = 'detecting' | 'validating' | 'saved'

export function FaceRegistrationModal({
  open,
  onClose,
  employeeName,
  onComplete,
}: {
  open: boolean
  onClose: () => void
  employeeName?: string
  onComplete?: (samples: number) => void
}) {
  const { toast } = useToast()
  const [phase, setPhase] = useState<Phase>('detecting')
  const [samples, setSamples] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (open) {
      setPhase('detecting')
      setSamples(0)
    }
    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [open])

  const capture = () => {
    setPhase('validating')
    timers.current.push(
      setTimeout(() => {
        setPhase('saved')
        setSamples((s) => s + 1)
      }, 1200),
    )
    timers.current.push(
      setTimeout(() => setPhase('detecting'), 2400),
    )
  }

  const finish = () => {
    toast({
      title: 'Đăng ký khuôn mặt thành công',
      description: `${samples} mẫu khuôn mặt đã được lưu.`,
      variant: 'success',
    })
    onComplete?.(samples || 5)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Đăng ký khuôn mặt"
      description={employeeName ? `Nhân viên: ${employeeName}` : 'Mô phỏng quy trình thu thập mẫu khuôn mặt.'}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[oklch(0.2_0.02_270)]">
        {/* simulated camera noise */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,oklch(0.35_0.03_270),oklch(0.16_0.02_270))]" />

        {/* face detection frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'relative flex size-44 items-center justify-center rounded-2xl border-2 transition-colors',
              phase === 'saved' ? 'border-success' : phase === 'validating' ? 'border-primary' : 'border-white/70',
            )}
          >
            <ScanFace className={cn('size-20', phase === 'saved' ? 'text-success' : 'text-white/60')} />
            {/* corner accents */}
            {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((c) => (
              <span key={c} className={cn('absolute size-5 rounded-[3px]', phase === 'saved' ? 'border-success' : 'border-primary', c)} />
            ))}
            {phase === 'detecting' && (
              <span className="absolute inset-x-2 top-2 h-0.5 animate-[scan_2s_ease-in-out_infinite] rounded bg-primary/80" />
            )}
          </div>
        </div>

        {/* status overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/40 py-2.5 text-sm text-white backdrop-blur-sm">
          {phase === 'detecting' && (
            <>
              <Loader2 className="size-4 animate-spin" /> Đang phát hiện khuôn mặt...
            </>
          )}
          {phase === 'validating' && (
            <>
              <Loader2 className="size-4 animate-spin" /> Đang xử lý mẫu...
            </>
          )}
          {phase === 'saved' && (
            <span className="flex items-center gap-2 font-medium text-success">
              <CheckCircle2 className="size-4" /> Khuôn mặt hợp lệ · Đã lưu mẫu
            </span>
          )}
        </div>

        {phase === 'detecting' && (
          <p className="absolute inset-x-0 top-4 text-center text-sm font-medium text-white/90">
            Đưa khuôn mặt vào khung hình
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
        <span className="text-sm text-muted-foreground">Số mẫu đã thu thập</span>
        <span className="text-sm font-semibold text-foreground">{samples} / 5 mẫu</span>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="lg" className="h-11 flex-1" onClick={onClose}>
          <X className="size-4" /> Hủy
        </Button>
        {samples >= 3 ? (
          <Button size="lg" className="h-11 flex-1" onClick={finish}>
            <CheckCircle2 className="size-4" /> Hoàn tất ({samples})
          </Button>
        ) : (
          <Button size="lg" className="h-11 flex-1" onClick={capture} disabled={phase !== 'detecting'}>
            <Camera className="size-4" /> Chụp ảnh
          </Button>
        )}
      </div>

      <style>{`@keyframes scan { 0%,100% { transform: translateY(0) } 50% { transform: translateY(150px) } }`}</style>
    </Modal>
  )
}
