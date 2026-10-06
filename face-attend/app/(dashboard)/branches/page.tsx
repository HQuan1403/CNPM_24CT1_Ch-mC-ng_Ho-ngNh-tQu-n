'use client'

import { useState } from 'react'
import { Plus, MapPin, Users, Camera, Building } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { branches as seed } from '@/lib/mock-data'

export default function BranchesPage() {
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
        name: String(data.get('name') || 'Chi nhánh mới'),
        city: String(data.get('city') || ''),
        address: String(data.get('address') || ''),
        employees: 0,
        devices: 0,
      },
    ])
    setOpen(false)
    toast({ title: 'Thêm chi nhánh thành công', variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Chi nhánh" description="Danh sách các chi nhánh và văn phòng của công ty.">
        <Button size="lg" className="h-10" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Thêm chi nhánh
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((b) => (
          <Card key={b.id} className="overflow-hidden">
            <div className="flex items-center gap-3 bg-primary/5 p-5">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{b.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" /> {b.city}</p>
              </div>
            </div>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{b.address}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-success/12 text-success"><Users className="size-4.5" /></div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{b.employees}</p>
                    <p className="text-xs text-muted-foreground">Nhân viên</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Camera className="size-4.5" /></div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{b.devices}</p>
                    <p className="text-xs text-muted-foreground">Thiết bị</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Thêm chi nhánh" description="Tạo chi nhánh mới.">
        <form onSubmit={add} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5"><Label htmlFor="name">Tên chi nhánh</Label><Input id="name" name="name" placeholder="Chi nhánh Cần Thơ" required /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="city">Thành phố</Label><Input id="city" name="city" placeholder="Cần Thơ" /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="address">Địa chỉ</Label><Input id="address" name="address" placeholder="Số nhà, đường, quận..." /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" size="lg" className="h-10">Lưu</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
