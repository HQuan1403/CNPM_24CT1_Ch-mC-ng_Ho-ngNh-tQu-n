'use client'

import { useMemo, useState } from 'react'
import { FileSpreadsheet, FileText, ChevronLeft, ChevronRight, ListChecks, CheckCircle2, Clock, LogOut, UserX } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { StatusBadge } from '@/components/status-badge'
import { useToast } from '@/components/ui/toast'
import { attendanceHistory, departments, branches, employees, historyStats } from '@/lib/mock-data'
import type { AttendanceStatus } from '@/lib/mock-data'

const PER_PAGE = 10

export default function HistoryPage() {
  const { toast } = useToast()
  const [dept, setDept] = useState('all')
  const [emp, setEmp] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () =>
      attendanceHistory.filter((h) => {
        const matchDept = dept === 'all' || h.department === dept
        const matchEmp = emp === 'all' || h.employeeId === emp
        const matchStatus = status === 'all' || h.status === (status as AttendanceStatus)
        return matchDept && matchEmp && matchStatus
      }),
    [dept, emp, status],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, totalPages)
  const rows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const reset = () => {
    setDept('all'); setEmp('all'); setStatus('all'); setPage(1)
  }

  return (
    <div>
      <PageHeader title="Lịch sử điểm danh" description="Tra cứu và xuất báo cáo chấm công theo bộ lọc.">
        <Button variant="outline" size="lg" className="h-10" onClick={() => toast({ title: 'Đang xuất file Excel...', description: 'Bảng chấm công sẽ được tải xuống.', variant: 'info' })}>
          <FileSpreadsheet className="size-4" /> Xuất Excel
        </Button>
        <Button variant="outline" size="lg" className="h-10" onClick={() => toast({ title: 'Đang xuất file PDF...', description: 'Báo cáo sẽ được tải xuống.', variant: 'info' })}>
          <FileText className="size-4" /> Xuất PDF
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat icon={ListChecks} tone="bg-primary/10 text-primary" label="Tổng lượt điểm danh" value={historyStats.total.toLocaleString('vi-VN')} />
        <Stat icon={CheckCircle2} tone="bg-success/12 text-success" label="Đúng giờ" value={historyStats.onTime.toLocaleString('vi-VN')} />
        <Stat icon={Clock} tone="bg-warning/18 text-[color:oklch(0.5_0.12_75)]" label="Đi trễ" value={historyStats.late} />
        <Stat icon={LogOut} tone="bg-warning/18 text-[color:oklch(0.5_0.12_75)]" label="Về sớm" value={historyStats.earlyLeave} />
        <Stat icon={UserX} tone="bg-destructive/12 text-destructive" label="Vắng" value={historyStats.absent} />
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Từ ngày</Label>
              <Input type="date" defaultValue="2026-09-01" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Đến ngày</Label>
              <Input type="date" defaultValue="2026-09-10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Nhân viên</Label>
              <Select value={emp} onChange={(e) => { setEmp(e.target.value); setPage(1) }}>
                <option value="all">Tất cả</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Phòng ban</Label>
              <Select value={dept} onChange={(e) => { setDept(e.target.value); setPage(1) }}>
                <option value="all">Tất cả</option>
                {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs">Trạng thái</Label>
              <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
                <option value="all">Tất cả</option>
                <option value="on-time">Đúng giờ</option>
                <option value="late">Đi trễ</option>
                <option value="early-leave">Về sớm</option>
                <option value="absent">Vắng</option>
              </Select>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Tìm thấy {filtered.length} bản ghi</p>
            <Button variant="ghost" size="sm" className="h-8" onClick={reset}>Đặt lại bộ lọc</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Ngày</TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Thời gian làm việc</TableHead>
                <TableHead className="pr-5">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="pl-5 font-medium">{h.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar name={h.name} className="size-8" />
                      <span className="font-medium text-foreground">{h.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{h.department}</TableCell>
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

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Trang {current} / {totalPages}
        </p>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" className="h-8" disabled={current === 1} onClick={() => setPage(current - 1)}>
            <ChevronLeft className="size-4" /> Trước
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={current === i + 1 ? 'default' : 'outline'}
              size="sm"
              className="h-8 w-8"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="h-8" disabled={current === totalPages} onClick={() => setPage(current + 1)}>
            Sau <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, tone, label, value }: { icon: React.ElementType; tone: string; label: string; value: string | number }) {
  return (
    <Card className="p-4">
      <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="size-4.5" />
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Card>
  )
}
