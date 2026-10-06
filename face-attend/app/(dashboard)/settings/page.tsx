'use client'

import { useState } from 'react'
import { Building2, ScanFace, ShieldCheck, Save, Upload } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/toast'
import { currentUser } from '@/lib/mock-data'

export default function SettingsPage() {
  const { toast } = useToast()
  const [toggles, setToggles] = useState({
    faceEnabled: true,
    earlyCheckIn: false,
    liveness: true,
    audit: true,
    twoFactor: false,
  })
  const set = (key: keyof typeof toggles) => (v: boolean) => setToggles((t) => ({ ...t, [key]: v }))

  return (
    <div>
      <PageHeader title="Cài đặt" description="Cấu hình thông tin công ty, quy tắc điểm danh và bảo mật.">
        <Button size="lg" className="h-10" onClick={() => toast({ title: 'Đã lưu cài đặt', variant: 'success' })}>
          <Save className="size-4" /> Lưu thay đổi
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-6">
        {/* Company info */}
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Building2 className="size-5" /></div>
            <div>
              <CardTitle>Thông tin công ty</CardTitle>
              <CardDescription>Thông tin hiển thị trên hệ thống và báo cáo.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex items-center gap-4 sm:col-span-2">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">A</div>
              <Button variant="outline" size="lg" className="h-10" onClick={() => toast({ title: 'Chọn logo mới', variant: 'info' })}>
                <Upload className="size-4" /> Tải logo lên
              </Button>
            </div>
            <div className="flex flex-col gap-1.5"><Label>Tên công ty</Label><Input defaultValue={currentUser.company} /></div>
            <div className="flex flex-col gap-1.5"><Label>Email</Label><Input defaultValue="contact@abc.com" /></div>
            <div className="flex flex-col gap-1.5"><Label>Số điện thoại</Label><Input defaultValue="024 3812 3456" /></div>
            <div className="flex flex-col gap-1.5"><Label>Địa chỉ</Label><Input defaultValue="180 Nguyễn Trãi, Thanh Xuân, Hà Nội" /></div>
          </CardContent>
        </Card>

        {/* Attendance settings */}
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><ScanFace className="size-5" /></div>
            <div>
              <CardTitle>Cài đặt điểm danh</CardTitle>
              <CardDescription>Quy tắc nhận diện và chấm công.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            <ToggleRow
              title="Cho phép nhận diện khuôn mặt"
              desc="Bật/tắt điểm danh bằng camera nhận diện khuôn mặt."
              checked={toggles.faceEnabled}
              onChange={set('faceEnabled')}
            />
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">Thời gian chống điểm danh trùng</p>
                <p className="text-sm text-muted-foreground">Khoảng thời gian tối thiểu giữa 2 lần điểm danh.</p>
              </div>
              <Select defaultValue="30" className="w-32"><option value="15">15 giây</option><option value="30">30 giây</option><option value="60">60 giây</option></Select>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium text-foreground">Ngưỡng nhận diện</p>
                <p className="text-sm text-muted-foreground">Độ tương đồng tối thiểu để xác nhận danh tính.</p>
              </div>
              <Select defaultValue="0.85" className="w-32"><option value="0.75">0.75</option><option value="0.85">0.85</option><option value="0.95">0.95</option></Select>
            </div>
            <ToggleRow
              title="Cho phép check-in sớm"
              desc="Nhân viên có thể điểm danh trước giờ ca làm."
              checked={toggles.earlyCheckIn}
              onChange={set('earlyCheckIn')}
            />
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><ShieldCheck className="size-5" /></div>
            <div>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Các tùy chọn tăng cường bảo mật hệ thống.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            <ToggleRow title="Liveness Detection" desc="Phát hiện khuôn mặt thật, chống giả mạo bằng ảnh/video." checked={toggles.liveness} onChange={set('liveness')} />
            <ToggleRow title="Audit Log" desc="Ghi lại toàn bộ hoạt động quản trị trên hệ thống." checked={toggles.audit} onChange={set('audit')} />
            <ToggleRow title="Two-factor authentication" desc="Yêu cầu xác thực 2 lớp khi đăng nhập quản trị." checked={toggles.twoFactor} onChange={set('twoFactor')} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ToggleRow({
  title,
  desc,
  checked,
  onChange,
}: {
  title: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground text-pretty">{desc}</p>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </div>
  )
}
