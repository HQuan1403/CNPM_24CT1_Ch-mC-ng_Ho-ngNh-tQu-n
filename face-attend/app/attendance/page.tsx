'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ScanFace, CheckCircle2, XCircle, Loader2, RefreshCw, ArrowLeft, Clock } from 'lucide-react'
import { Logo } from '@/components/dashboard/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'scanning' | 'success' | 'error'

export default function KioskPage() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [now, setNow] = useState<Date | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => {
      clearInterval(t)
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const scan = (outcome: 'success' | 'error') => {
    setPhase('scanning')
    timers.current.push(setTimeout(() => setPhase(outcome), 2200))
  }

  const reset = () => setPhase('idle')

  const time = now
    ? now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'
  const date = now
    ? now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''

  return (
    <div className="flex min-h-dvh flex-col bg-[oklch(0.18_0.02_275)] text-white">
      <header className="flex items-center justify-between px-6 py-4">
        <Logo className="[&_span]:text-white" />
        <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="size-4" /> Thoát Kiosk
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
        <h1 className="text-2xl font-bold tracking-wide sm:text-3xl">ĐIỂM DANH NHÂN VIÊN</h1>
        <div className="mt-2 flex items-center gap-2 text-white/60">
          <Clock className="size-4" />
          <span className="font-mono text-lg">{time}</span>
          <span className="capitalize">· {date}</span>
        </div>

        {/* Camera frame */}
        <div className="relative mt-8 aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_40%,oklch(0.32_0.03_275),oklch(0.15_0.02_275))] shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                'relative flex size-56 items-center justify-center rounded-3xl border-2 transition-colors duration-300',
                phase === 'success' ? 'border-success' : phase === 'error' ? 'border-destructive' : 'border-white/50',
              )}
            >
              <ScanFace
                className={cn(
                  'size-28 transition-colors',
                  phase === 'success' ? 'text-success' : phase === 'error' ? 'text-destructive' : 'text-white/40',
                )}
              />
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((c) => (
                <span
                  key={c}
                  className={cn(
                    'absolute size-8 rounded-lg border-4',
                    phase === 'success' ? 'border-success' : phase === 'error' ? 'border-destructive' : 'border-primary',
                    c.includes('top') ? 'border-b-0' : 'border-t-0',
                    c.includes('left') ? 'border-r-0' : 'border-l-0',
                    c,
                  )}
                />
              ))}
              {phase === 'scanning' && (
                <span className="absolute inset-x-3 top-3 h-1 animate-[kscan_2.2s_ease-in-out_infinite] rounded bg-primary" />
              )}
            </div>
          </div>

          {phase === 'success' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-success/15 backdrop-blur-sm animate-in fade-in zoom-in-95">
              <div className="flex size-24 items-center justify-center rounded-full bg-success text-white shadow-lg animate-in zoom-in">
                <CheckCircle2 className="size-14" />
              </div>
              <p className="mt-4 text-xl font-bold text-success">Điểm danh thành công</p>
              <p className="mt-3 text-2xl font-bold">Nguyễn Văn An</p>
              <p className="text-white/70">Mã nhân viên: NV001</p>
              <div className="mt-3 rounded-full bg-white/10 px-4 py-1.5 font-mono text-sm">
                Check-in: 07:58:23
              </div>
            </div>
          )}

          {phase === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/15 backdrop-blur-sm animate-in fade-in zoom-in-95">
              <div className="flex size-24 items-center justify-center rounded-full bg-destructive text-white shadow-lg">
                <XCircle className="size-14" />
              </div>
              <p className="mt-4 text-xl font-bold text-destructive">Không nhận diện được khuôn mặt</p>
              <p className="mt-1 text-white/70">Vui lòng thử lại.</p>
            </div>
          )}
        </div>

        {/* status text + controls */}
        <div className="mt-8 flex min-h-24 flex-col items-center gap-4">
          {phase === 'idle' && (
            <>
              <p className="text-lg text-white/80">Vui lòng nhìn vào camera</p>
              <div className="flex gap-3">
                <Button size="lg" className="h-12 px-8 text-base" onClick={() => scan('success')}>
                  <ScanFace className="size-5" /> Bắt đầu điểm danh
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/20 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
                  onClick={() => scan('error')}
                >
                  Mô phỏng lỗi
                </Button>
              </div>
            </>
          )}
          {phase === 'scanning' && (
            <p className="flex items-center gap-2 text-lg text-white/80">
              <Loader2 className="size-5 animate-spin" /> Đang nhận diện khuôn mặt...
            </p>
          )}
          {(phase === 'success' || phase === 'error') && (
            <Button size="lg" className="h-12 px-8 text-base" onClick={reset}>
              <RefreshCw className="size-5" /> {phase === 'error' ? 'Thử lại' : 'Điểm danh tiếp'}
            </Button>
          )}
        </div>
      </div>

      <style>{`@keyframes kscan { 0%,100% { transform: translateY(0) } 50% { transform: translateY(200px) } }`}</style>
    </div>
  )
}
