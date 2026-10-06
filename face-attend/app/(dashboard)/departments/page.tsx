'use client'

import { useState } from 'react'
import { Plus, Building2, Users, TrendingUp, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import { departments as seed, employees } from '@/lib/mock-data'

export default function DepartmentsPage() {
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
        name: String(data.get('name') || 'Phòng mới'),
        manager: String(data.get('manager') || '—'),
        employees: 0,
        rate: 0,
      },
    ])
    setOpen(false)
    toast({ title: 'Thêm phòng ban thành công', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Phòng ban" description="Cơ cấu tổ chức và tỷ lệ chấm công theo từng phòng ban.">
        <Button size="lg" className="h-10" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Thêm phòng ban
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{d.name}</h3>
                    <p className="text-xs text-muted-foreground">Phòng ban</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => toast({ title: 'Chỉnh sửa phòng ban', variant: 'info' })} aria-label="Chỉnh sửa">
                  <Pencil className="size-4" />
                </Button>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <Avatar name={d.manager} className="size-9" />
                <div>
                  <p className="text-xs text-muted-foreground">Trưởng phòng</p>
                  <p className="text-sm font-medium text-foreground">{d.manager}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="size-4" /><span className="text-xs">Nhân viên</span></div>
                  <p className="mt-1 text-xl font-bold text-foreground">{d.employees}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><TrendingUp className="size-4" /><span className="text-xs">Tỷ lệ có mặt</span></div>
                  <p className="mt-1 text-xl font-bold text-success">{d.rate}%</p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${d.rate}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm phòng ban" description="Tạo phòng ban mới cho công ty.">
        <form onSubmit={add} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Tên phòng ban</Label>
            <Input id="name" name="name" placeholder="Vận hành" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Trưởng phòng</Label>
            <Select name="manager">
              {employees.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" size="lg" className="h-10">Lưu</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
