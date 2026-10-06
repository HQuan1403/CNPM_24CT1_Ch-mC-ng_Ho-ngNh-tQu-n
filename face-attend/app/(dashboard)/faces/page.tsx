'use client'

import { useMemo, useState } from 'react'
import { Search, ScanFace, CheckCircle2, AlertTriangle, Plus, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FaceRegistrationModal } from '@/components/face-registration-modal'
import { employees as seed } from '@/lib/mock-data'

export default function FacesPage() {
  const [list, setList] = useState(seed)
  const [query, setQuery] = useState('')
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null)

  const filtered = useMemo(
    () => list.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()) || e.code.toLowerCase().includes(query.toLowerCase())),
    [list, query],
  )
  const registered = list.filter((e) => e.faceRegistered).length

  const complete = (samples: number) => {
    if (!target) return
    setList((prev) =>
      prev.map((e) => (e.id === target.id ? { ...e, faceRegistered: true, faceSamples: samples, faceUpdated: '10/09/2026' } : e)),
    )
  }

  return (
    <div>
      <PageHeader
        title="Quản lý khuôn mặt"
        description="Quản lý dữ liệu khuôn mặt được sử dụng cho hệ thống nhận diện và điểm danh."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Đã đăng ký khuôn mặt" value={registered} icon={CheckCircle2} tone="success" />
        <StatCard label="Chưa đăng ký" value={list.length - registered} icon={AlertTriangle} tone="warning" />
        <StatCard label="Ngưỡng nhận diện" value="0.85" icon={ShieldCheck} tone="primary" />
      </div>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm nhân viên..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Nhân viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số mẫu</TableHead>
                <TableHead>Cập nhật gần nhất</TableHead>
                <TableHead className="pr-5 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.name} className="size-9" />
                      <div>
                        <p className="font-medium text-foreground">{e.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{e.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {e.faceRegistered ? (
                      <Badge variant="success"><CheckCircle2 className="size-3.5" /> Đã đăng ký</Badge>
                    ) : (
                      <Badge variant="warning"><AlertTriangle className="size-3.5" /> Chưa đăng ký</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.faceRegistered ? `${e.faceSamples} mẫu` : '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{e.faceUpdated ? `Cập nhật: ${e.faceUpdated}` : '—'}</TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button
                      variant={e.faceRegistered ? 'outline' : 'default'}
                      size="sm"
                      className="h-8"
                      onClick={() => setTarget({ id: e.id, name: e.name })}
                    >
                      {e.faceRegistered ? <ScanFace className="size-3.5" /> : <Plus className="size-3.5" />}
                      {e.faceRegistered ? 'Cập nhật' : 'Đăng ký'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <FaceRegistrationModal
        open={!!target}
        onClose={() => setTarget(null)}
        employeeName={target?.name}
        onComplete={complete}
      />
    </div>
  )
}
