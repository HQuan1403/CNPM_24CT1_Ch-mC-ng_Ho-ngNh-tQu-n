'use client'

import { Plus, ShieldCheck, Users, Check, X } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/toast'
import { roles, permissionMatrix } from '@/lib/mock-data'

export default function RolesPage() {
  const { toast } = useToast()

  return (
    <div>
      <PageHeader title="Phân quyền" description="Quản lý vai trò và quyền truy cập của người dùng trong hệ thống.">
        <Button size="lg" className="h-10" onClick={() => toast({ title: 'Mở form tạo vai trò mới', variant: 'info' })}>
          <Plus className="size-4" /> Thêm vai trò
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {roles.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex size-11 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklch, ${r.color} 14%, transparent)` }}>
              <ShieldCheck className="size-5" style={{ color: r.color }} />
            </div>
            <h3 className="mt-3 font-semibold text-foreground">{r.name}</h3>
            <p className="mt-1 min-h-10 text-xs text-muted-foreground text-pretty">{r.description}</p>
            <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-sm text-muted-foreground">
              <Users className="size-4" /> {r.members} người dùng
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Ma trận phân quyền</CardTitle></CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Vai trò</TableHead>
                {permissionMatrix.columns.map((c) => (
                  <TableHead key={c} className="text-center">{c}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionMatrix.rows.map((row) => (
                <TableRow key={row.role}>
                  <TableCell className="pl-5 font-medium text-foreground">{row.role}</TableCell>
                  {row.perms.map((p, i) => (
                    <TableCell key={i} className="text-center">
                      {p ? (
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-success/15 text-success">
                          <Check className="size-4" />
                        </span>
                      ) : (
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <X className="size-4" />
                        </span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
