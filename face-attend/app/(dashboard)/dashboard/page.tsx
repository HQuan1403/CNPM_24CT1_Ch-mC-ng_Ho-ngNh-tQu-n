'use client'

import Link from 'next/link'
import { Users, UserCheck, Clock, UserX, TrendingUp, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/status-badge'
import { LineChart } from '@/components/charts'
import { dashboardStats, weeklyAttendance, todayAttendance, recentActivity } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Tổng quan" description="Chào buổi sáng, Nguyễn Văn Admin 👋 — đây là tình hình chấm công hôm nay." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Tổng nhân viên" value={dashboardStats.totalEmployees} icon={Users} tone="primary" />
        <StatCard label="Đã điểm danh hôm nay" value={dashboardStats.checkedInToday} icon={UserCheck} tone="success" trend={{ value: '+4 so với hôm qua', up: true }} />
        <StatCard label="Đi trễ" value={dashboardStats.late} icon={Clock} tone="warning" />
        <StatCard label="Chưa điểm danh" value={dashboardStats.notChecked} icon={UserX} tone="destructive" />
        <StatCard label="Tỷ lệ có mặt" value={`${dashboardStats.attendanceRate}%`} icon={TrendingUp} tone="primary" trend={{ value: '+1.3%', up: true }} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Thống kê điểm danh 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              labels={weeklyAttendance.labels}
              series={[
                { name: 'Có mặt', color: 'var(--color-chart-1)', values: weeklyAttendance.present },
                { name: 'Đi trễ', color: 'var(--color-chart-3)', values: weeklyAttendance.late },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <Avatar name={a.name} className="size-9" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">
                      <span className="font-semibold">{a.name}</span> {a.action}{' '}
                      <span className="font-medium text-primary">{a.time}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{a.ago}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Điểm danh hôm nay</CardTitle>
          <Link
            href="/attendance/history"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Xem tất cả <ArrowRight className="size-4" />
          </Link>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Nhân viên</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead className="pr-5">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayAttendance.map((r) => (
                <TableRow key={r.employeeId}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} className="size-9" />
                      <span className="font-medium text-foreground">{r.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.department}</TableCell>
                  <TableCell className="font-mono text-sm">{r.checkIn ?? '—'}</TableCell>
                  <TableCell className="font-mono text-sm">{r.checkOut ?? '—'}</TableCell>
                  <TableCell className="pr-5">
                    <StatusBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
