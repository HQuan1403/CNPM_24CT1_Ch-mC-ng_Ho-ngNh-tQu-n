'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/dashboard/logo'
import { Input, Label } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@abc.com')
  const [password, setPassword] = useState('123456')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 700)
  }

  return (
    <div className="flex min-h-dvh">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <Logo className="[&_span]:text-primary-foreground [&_.text-primary]:text-primary-foreground" />
        <div className="relative z-10">
          <h2 className="max-w-md text-3xl font-bold leading-tight text-balance">
            Chấm công thông minh bằng nhận diện khuôn mặt
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80 text-pretty">
            Quản lý nhân viên, ca làm việc, thiết bị và báo cáo chấm công trên một nền tảng duy nhất — nhanh chóng, chính xác và bảo mật.
          </p>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-3xl font-bold">250+</p>
              <p className="text-sm text-primary-foreground/70">Nhân viên</p>
            </div>
            <div>
              <p className="text-3xl font-bold">99.2%</p>
              <p className="text-sm text-primary-foreground/70">Độ chính xác</p>
            </div>
            <div>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-primary-foreground/70">Chi nhánh</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-sm text-primary-foreground/60">© 2026 FaceAttend — ABC Technology</p>
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-white/5" />
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Đăng nhập hệ thống</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Nhập thông tin tài khoản quản trị để tiếp tục.
          </p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" defaultChecked className="size-4 rounded border-input accent-primary" />
                Ghi nhớ đăng nhập
              </label>
              <button type="button" className="font-medium text-primary hover:underline">
                Quên mật khẩu?
              </button>
            </div>

            <Button type="submit" size="lg" className="mt-2 h-11 w-full text-sm" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Tài khoản demo</p>
              <p className="text-muted-foreground">
                Email: <span className="font-mono text-foreground">admin@abc.com</span>
                <br />
                Mật khẩu: <span className="font-mono text-foreground">123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
