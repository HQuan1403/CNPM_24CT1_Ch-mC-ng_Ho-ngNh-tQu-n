'use client'

import { CalendarDays, Clock, UserX, LogOut, Timer, Download } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { LineChart, HorizontalBars, GroupedBarChart, Donut } from '@/components/charts'
import { useToast } from '@/components/ui/toast'
import { reportSummary, departmentRates, monthlyRate, monthlyLate } from '@/lib/mock-data'

export default function ReportsPage() {
  const { toast } = useToast()

  const summary = [
    { icon: CalendarDays, label: 'Tổng ngày công', value: reportSummary.totalWorkdays.toLocaleString('vi-VN'), tone: 'bg-primary/10 text-primary' },
    { icon: Clock, label: 'Đi trễ', value: reportSummary.late, tone: 'bg-warning/18 text-[color:oklch(0.5_0.12_75)]' },
    { icon: UserX, label: 'Vắng', value: reportSummary.absent, tone: 'bg-destructive/12 text-destructive' },
    { icon: LogOut, label: 'Về sớm', value: reportSummary.earlyLeave, tone: 'bg-warning/18 text-[color:oklch(0.5_0.12_75)]' },
    { icon: Timer, label: 'Tăng ca', value: `${reportSummary.overtime} giờ`, tone: 'bg-success/12 text-success' },
  ]

  return (
    <div>
      <PageHeader title="Báo cáo" description="Thống kê chấm công toàn công ty theo tháng.">
        <Select defaultValue="9" className="h-10 w-40">
          <option value="9">Tháng 9, 2026</option>
          <option value="8">Tháng 8, 2026</option>
          <option value="7">Tháng 7, 2026</option>
        </Select>
        <Button size="lg" className="h-10" onClick={() => toast({ title: 'Đang xuất báo cáo...', description: 'File báo cáo tháng 9 sẽ được tải xuống.', variant: 'info' })}>
          <Download className="size-4" /> Xuất báo cáo
        </Button>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {summary.map((s) => (
          <Card key={s.label} className="p-4">
            <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${s.tone}`}>
              <s.icon className="size-4.5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Tỷ lệ có mặt theo ngày</CardTitle></CardHeader>
          <CardContent>
            <LineChart
              labels={monthlyRate.labels}
              series={[{ name: 'Tỷ lệ có mặt (%)', color: 'var(--color-chart-1)', values: monthlyRate.values }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tỷ lệ có mặt trung bình</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-4">
            <Donut value={90} label="Toàn công ty" size={180} />
            <p className="mt-2 text-center text-sm text-muted-foreground">Tăng 1.3% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Tỷ lệ có mặt theo phòng ban</CardTitle></CardHeader>
          <CardContent>
            <HorizontalBars data={departmentRates} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Đi trễ & vắng theo tháng</CardTitle></CardHeader>
          <CardContent>
            <GroupedBarChart
              labels={monthlyLate.labels}
              series={[
                { name: 'Đi trễ', color: 'var(--color-chart-3)', values: monthlyLate.values },
                { name: 'Vắng', color: 'var(--color-chart-4)', values: monthlyLate.values.map((v) => Math.round(v * 0.6)) },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Giờ làm việc theo phòng ban</CardTitle></CardHeader>
        <CardContent>
          <HorizontalBars
            data={[
              { label: 'Sales', value: 9820, sub: '9.820 giờ', color: 'var(--color-chart-4)' },
              { label: 'IT', value: 7640, sub: '7.640 giờ', color: 'var(--color-chart-1)' },
              { label: 'Marketing', value: 5120, sub: '5.120 giờ', color: 'var(--color-chart-5)' },
              { label: 'Accounting', value: 3480, sub: '3.480 giờ', color: 'var(--color-chart-2)' },
              { label: 'HR', value: 2960, sub: '2.960 giờ', color: 'var(--color-chart-3)' },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
