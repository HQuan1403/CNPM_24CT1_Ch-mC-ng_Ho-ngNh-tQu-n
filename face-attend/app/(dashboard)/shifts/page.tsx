'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Clock, Coffee, Users, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { shifts as seed } from '@/lib/mock-data'

export default function ShiftsPage() {
  const { toast } = useToast()
  const [list, setList] = useState(seed)
  const [open, setOpen] = useState(false)

  const add = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    setList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: String(data.get('name') || 'Ca mới'),
        start: String(data.get('start') || '08:00'),
        end: String(data.get('end') || '17:00'),
        breakStart: String(data.get('breakStart') || '12:00'),
        breakEnd: String(data.get('breakEnd') || '13:00'),
        lateAllowance: Number(data.get('late') || 10),
        employees: 0,
        color: 'var(--color-chart-5)',
      },
    ])
    setOpen(false)
    toast({ title: 'Thêm ca làm việc thành công', variant: 'success' })
  }

  const remove = (id: string) => {
    setList((prev) => prev.filter((s) => s.id !== id))
    toast({ title: 'Đã xóa ca làm việc', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Quản lý ca làm việc" description="Thiết lập giờ làm, giờ nghỉ và quy định đi trễ cho từng ca.">
        <Button size="lg" className="h-10" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Thêm ca
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <div className="h-1.5 w-full" style={{ background: s.color }} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{s.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-2xl font-bold text-foreground">
                    <span className="font-mono">{s.start}</span>
                    <ArrowRight className="size-5 text-muted-foreground" />
                    <span className="font-mono">{s.end}</span>
                  </div>
                </div>
                <div className="flex size-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklch, ${s.color} 14%, transparent)` }}>
                  <Clock className="size-5" style={{ color: s.color }} />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Coffee className="size-4" /> Nghỉ trưa: <span className="font-medium text-foreground">{s.breakStart} → {s.breakEnd}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-4" /> Cho phép đi trễ: <span className="font-medium text-foreground">{s.lateAllowance} phút</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="size-4" /> Áp dụng: <span className="font-medium text-foreground">{s.employees} nhân viên</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" className="h-8 flex-1" onClick={() => toast({ title: 'Mở form chỉnh sửa ca', variant: 'info' })}>
                  <Pencil className="size-3.5" /> Chỉnh sửa
                </Button>
                <Button variant="destructive" size="sm" className="h-8" onClick={() => remove(s.id)}>
                  <Trash2 className="size-3.5" /> Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm ca làm việc" description="Thiết lập thông tin ca mới.">
        <form onSubmit={add} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="name">Tên ca</Label>
            <Input id="name" name="name" placeholder="Ca tối" required />
          </div>
          <div className="flex flex-col gap-1.5"><Label>Giờ bắt đầu</Label><Input name="start" type="time" defaultValue="08:00" /></div>
          <div className="flex flex-col gap-1.5"><Label>Giờ kết thúc</Label><Input name="end" type="time" defaultValue="17:00" /></div>
          <div className="flex flex-col gap-1.5"><Label>Nghỉ từ</Label><Input name="breakStart" type="time" defaultValue="12:00" /></div>
          <div className="flex flex-col gap-1.5"><Label>Nghỉ đến</Label><Input name="breakEnd" type="time" defaultValue="13:00" /></div>
          <div className="col-span-2 flex flex-col gap-1.5"><Label>Cho phép đi trễ (phút)</Label><Input name="late" type="number" defaultValue="10" /></div>
          <div className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" size="lg" className="h-10">Lưu ca</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
