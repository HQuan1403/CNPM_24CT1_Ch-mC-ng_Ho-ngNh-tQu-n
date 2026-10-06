'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Calendar, Building2, MapPin, CheckCircle2, ScanFace, Plus, Pencil } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/status-badge'
import { FaceRegistrationModal } from '@/components/face-registration-modal'
import { employees, attendanceHistory } from '@/lib/mock-data'

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const employee = employees.find((e) => e.id === id) ?? employees[0]
  const [tab, setTab] = useState(searchParams.get('tab') === 'face' ? 'face' : 'info')
  const [faceOpen, setFaceOpen] = useState(false)
  const [face, setFace] = useState({ registered: employee.faceRegistered, samples: employee.faceSamples })

  const history = attendanceHistory.filter((h) => h.employeeId === employee.id).slice(0, 8)
  const summary = [
    { label: 'Ngày công', value: '21', tone: 'text-foreground' },
    { label: 'Đi trễ', value: '3', tone: 'text-warning' },
    { label: 'Về sớm', value: '1', tone: 'text-warning' },
    { label: 'Vắng', value: '2', tone: 'text-destructive' },
    { label: 'Tăng ca', value: '12h', tone: 'text-primary' },
  ]

  return (
    <div>
      <Link href="/employees" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Quay lại danh sách
      </Link>

      <Card>
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar name={employee.name} className="size-20 text-2xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{employee.name}</h1>
              <Badge variant="neutral" className="font-mono">{employee.code}</Badge>
              {employee.status === 'active' ? (
                <Badge variant="success">Đang làm việc</Badge>
              ) : (
                <Badge variant="neutral">Vô hiệu hóa</Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><ScanFace className="size-4" /> {employee.position}</span>
              <span className="flex items-center gap-1.5"><Building2 className="size-4" /> Phòng {employee.department}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-4" /> Chi nhánh {employee.branch}</span>
            </div>
          </div>
          <Button variant="outline" size="lg" className="h-10"><Pencil className="size-4" /> Chỉnh sửa</Button>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: 'info', label: 'Thông tin' },
            { value: 'face', label: 'Khuôn mặt' },
            { value: 'history', label: 'Lịch sử điểm danh' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'info' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Thông tin cá nhân</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Info icon={Mail} label="Email" value={employee.email} />
              <Info icon={Phone} label="Số điện thoại" value={employee.phone} />
              <Info icon={Building2} label="Phòng ban" value={`Phòng ${employee.department}`} />
              <Info icon={MapPin} label="Chi nhánh" value={employee.branch} />
              <Info icon={ScanFace} label="Chức vụ" value={employee.position} />
              <Info icon={Calendar} label="Ngày vào làm" value={employee.startDate} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tổng hợp chấm công tháng 9</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {summary.map((s) => (
                <div key={s.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-2.5">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={`text-lg font-bold ${s.tone}`}>{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'face' && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Mẫu khuôn mặt đã đăng ký</CardTitle>
              <Button size="lg" className="h-9" onClick={() => setFaceOpen(true)}>
                <Plus className="size-4" /> Đăng ký khuôn mặt
              </Button>
            </CardHeader>
            <CardContent>
              {face.registered ? (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {Array.from({ length: face.samples }).map((_, i) => (
                    <div key={i} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-border bg-muted/40">
                      <ScanFace className="size-8 text-primary/70" />
                      <span className="text-xs text-muted-foreground">Mẫu {i + 1}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-warning/15 text-warning">
                    <ScanFace className="size-7" />
                  </div>
                  <p className="text-sm text-muted-foreground">Nhân viên chưa đăng ký khuôn mặt.</p>
                  <Button className="h-9" onClick={() => setFaceOpen(true)}><Plus className="size-4" /> Đăng ký ngay</Button>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Trạng thái khuôn mặt</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {face.registered ? (
                <div className="flex items-center gap-3 rounded-lg bg-success/10 px-4 py-3 text-success">
                  <CheckCircle2 className="size-5" />
                  <span className="text-sm font-medium">Đã đăng ký khuôn mặt</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg bg-warning/12 px-4 py-3 text-[color:oklch(0.5_0.12_75)]">
                  <ScanFace className="size-5" />
                  <span className="text-sm font-medium">Chưa đăng ký khuôn mặt</span>
                </div>
              )}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Số mẫu</span><span className="font-medium">{face.samples} mẫu</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Cập nhật</span><span className="font-medium">{employee.faceUpdated ?? '—'}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Độ tin cậy</span><span className="font-medium text-success">99.1%</span></div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'history' && (
        <Card className="mt-6">
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Ngày</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Thời gian làm việc</TableHead>
                  <TableHead className="pr-5">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="pl-5 font-medium">{h.date}</TableCell>
                    <TableCell className="font-mono text-sm">{h.checkIn ?? '—'}</TableCell>
                    <TableCell className="font-mono text-sm">{h.checkOut ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground">{h.worked}</TableCell>
                    <TableCell className="pr-5"><StatusBadge status={h.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <FaceRegistrationModal
        open={faceOpen}
        onClose={() => setFaceOpen(false)}
        employeeName={employee.name}
        onComplete={(samples) => setFace({ registered: true, samples })}
      />
    </div>
  )
}

function Info({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4.5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
