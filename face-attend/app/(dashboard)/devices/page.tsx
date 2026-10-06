'use client'

import { useState } from 'react'
import { Plus, Camera, Wifi, WifiOff } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { devices as seed, branches } from '@/lib/mock-data'

export default function DevicesPage() {
  const { toast } = useToast()
  const [list, setList] = useState(seed)
  const [open, setOpen] = useState(false)

  const online = list.filter((d) => d.status === 'online').length

  const add = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: String(data.get('name') || 'Camera mới'),
        camId: String(data.get('camId') || 'CAM-000'),
        location: String(data.get('location') || ''),
        branch: String(data.get('branch') || 'Trụ sở chính'),
        status: 'online' as const,
        lastActive: 'Vừa xong',
      },
    ])
    setOpen(false)
    toast({ title: 'Thêm thiết bị thành công', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Thiết bị" description="Quản lý camera nhận diện khuôn mặt tại các điểm điểm danh.">
        <Button size="lg" className="h-10" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Thêm thiết bị
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Tổng thiết bị" value={list.length} icon={Camera} tone="primary" />
        <StatCard label="Đang hoạt động" value={online} icon={Wifi} tone="success" />
        <StatCard label="Mất kết nối" value={list.length - online} icon={WifiOff} tone="destructive" />
      </div>

      <Card className="mt-6">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Thiết bị</TableHead>
                <TableHead>Camera ID</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="pr-5">Hoạt động gần nhất</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Camera className="size-4.5" />
                      </div>
                      <span className="font-medium text-foreground">{d.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{d.camId}</TableCell>
                  <TableCell>{d.location}</TableCell>
                  <TableCell className="text-muted-foreground">{d.branch}</TableCell>
                  <TableCell>
                    {d.status === 'online' ? (
                      <Badge variant="success"><span className="size-1.5 rounded-full bg-success" /> Online</Badge>
                    ) : (
                      <Badge variant="destructive"><span className="size-1.5 rounded-full bg-destructive" /> Offline</Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-5 text-muted-foreground">{d.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm thiết bị" description="Đăng ký camera nhận diện mới.">
        <form onSubmit={add} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5"><Label htmlFor="name">Tên thiết bị</Label><Input id="name" name="name" placeholder="Camera 07" required /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="camId">Camera ID</Label><Input id="camId" name="camId" placeholder="CAM-007" /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="location">Vị trí</Label><Input id="location" name="location" placeholder="Cổng chính" /></div>
          <div className="flex flex-col gap-1.5">
            <Label>Chi nhánh</Label>
            <Select name="branch">
              {branches.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
            </Select>
          </div>
          <div className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" size="lg" className="h-10">Lưu thiết bị</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
