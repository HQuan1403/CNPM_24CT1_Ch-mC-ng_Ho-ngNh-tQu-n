'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, MoreHorizontal, Eye, Pencil, ScanFace, Ban } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { employees as seed, departments, branches } from '@/lib/mock-data'

export default function EmployeesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [list, setList] = useState(seed)
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('all')
  const [status, setStatus] = useState('all')
  const [open, setOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      list.filter((e) => {
        const q = query.toLowerCase()
        const matchQuery = e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
        const matchDept = dept === 'all' || e.department === dept
        const matchStatus = status === 'all' || e.status === status
        return matchQuery && matchDept && matchStatus
      }),
    [list, query, dept, status],
  )

  const deactivate = (id: string) => {
    setList((prev) => prev.map((e) => (e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e)))
    setMenuId(null)
    toast({ title: 'Đã cập nhật trạng thái nhân viên', variant: 'success' })
  }

  const addEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') || 'Nhân viên mới')
    const newEmp = {
      id: String(Date.now()),
      code: String(data.get('code') || `NV${list.length + 1}`),
      name,
      email: String(data.get('email') || ''),
      phone: String(data.get('phone') || ''),
      department: String(data.get('department') || 'IT'),
      branch: String(data.get('branch') || 'Hà Nội'),
      position: String(data.get('position') || ''),
      startDate: String(data.get('startDate') || ''),
      status: (String(data.get('status') || 'active') as 'active' | 'inactive'),
      faceRegistered: false,
      faceSamples: 0,
    }
    setList((prev) => [newEmp, ...prev])
    setOpen(false)
    toast({ title: 'Thêm nhân viên thành công', description: `${name} đã được thêm vào hệ thống.`, variant: 'success' })
  }

  return (
    <div>
      <PageHeader title="Quản lý nhân viên" description="Danh sách và thông tin toàn bộ nhân viên trong công ty.">
        <Button size="lg" className="h-10" onClick={() => setOpen(true)}>
          <Plus className="size-4" /> Thêm nhân viên
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên, mã hoặc email..."
                className="pl-9"
              />
            </div>
            <Select value={dept} onChange={(e) => setDept(e.target.value)} className="sm:w-48">
              <option value="all">Tất cả phòng ban</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-44">
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="inactive">Vô hiệu hóa</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Nhân viên</TableHead>
                <TableHead>Mã NV</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Chi nhánh</TableHead>
                <TableHead>Trạng thái</TableHead>
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
                        <p className="text-xs text-muted-foreground">{e.position}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{e.code}</TableCell>
                  <TableCell className="text-muted-foreground">{e.email}</TableCell>
                  <TableCell>{e.department}</TableCell>
                  <TableCell className="text-muted-foreground">{e.branch}</TableCell>
                  <TableCell>
                    {e.status === 'active' ? (
                      <Badge variant="success"><span className="size-1.5 rounded-full bg-success" /> Đang làm việc</Badge>
                    ) : (
                      <Badge variant="neutral"><span className="size-1.5 rounded-full bg-muted-foreground" /> Vô hiệu hóa</Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setMenuId(menuId === e.id ? null : e.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Thao tác"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                      {menuId === e.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} aria-hidden="true" />
                          <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-border bg-card py-1 text-left shadow-lg">
                            <button onClick={() => router.push(`/employees/${e.id}`)} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted">
                              <Eye className="size-4 text-muted-foreground" /> Xem
                            </button>
                            <button onClick={() => { setMenuId(null); toast({ title: 'Mở form chỉnh sửa', variant: 'info' }) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted">
                              <Pencil className="size-4 text-muted-foreground" /> Chỉnh sửa
                            </button>
                            <button onClick={() => router.push(`/employees/${e.id}?tab=face`)} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted">
                              <ScanFace className="size-4 text-muted-foreground" /> Quản lý khuôn mặt
                            </button>
                            <button onClick={() => deactivate(e.id)} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                              <Ban className="size-4" /> {e.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy nhân viên phù hợp.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="mt-3 text-sm text-muted-foreground">Hiển thị {filtered.length} / {list.length} nhân viên</p>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm nhân viên"
        description="Điền thông tin để tạo hồ sơ nhân viên mới."
        className="max-w-2xl"
      >
        <form id="add-employee" onSubmit={addEmployee} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Họ và tên" name="name" placeholder="Nguyễn Văn A" required />
          <Field label="Mã nhân viên" name="code" placeholder="NV013" required />
          <Field label="Email" name="email" type="email" placeholder="a.nguyen@abc.com" />
          <Field label="Số điện thoại" name="phone" placeholder="0901234567" />
          <div className="flex flex-col gap-1.5">
            <Label>Phòng ban</Label>
            <Select name="department" defaultValue="IT">
              {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
          </div>
          <Field label="Chức vụ" name="position" placeholder="Developer" />
          <div className="flex flex-col gap-1.5">
            <Label>Chi nhánh</Label>
            <Select name="branch" defaultValue="Hà Nội">
              {branches.map((b) => <option key={b.id} value={b.city}>{b.name}</option>)}
            </Select>
          </div>
          <Field label="Ngày bắt đầu" name="startDate" type="date" />
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label>Trạng thái</Label>
            <Select name="status" defaultValue="active">
              <option value="active">Đang làm việc</option>
              <option value="inactive">Vô hiệu hóa</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="submit" size="lg" className="h-10">Lưu nhân viên</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function Field({ label, name, ...props }: { label: string; name: string } & React.ComponentProps<'input'>) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  )
}
