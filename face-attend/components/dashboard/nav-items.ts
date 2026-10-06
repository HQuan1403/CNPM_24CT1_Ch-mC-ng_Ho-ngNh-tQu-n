import {
  LayoutDashboard,
  Users,
  ScanFace,
  CalendarCheck,
  Clock,
  Building2,
  MapPin,
  Camera,
  FileBarChart,
  ShieldCheck,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** extra path prefixes that should mark this item active */
  match?: string[]
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Nhân viên', href: '/employees', icon: Users },
  { label: 'Khuôn mặt', href: '/faces', icon: ScanFace },
  { label: 'Điểm danh', href: '/attendance/history', icon: CalendarCheck, match: ['/attendance'] },
  { label: 'Ca làm việc', href: '/shifts', icon: Clock },
  { label: 'Phòng ban', href: '/departments', icon: Building2 },
  { label: 'Chi nhánh', href: '/branches', icon: MapPin },
  { label: 'Thiết bị', href: '/devices', icon: Camera },
  { label: 'Báo cáo', href: '/reports', icon: FileBarChart },
  { label: 'Phân quyền', href: '/roles', icon: ShieldCheck },
  { label: 'Cài đặt', href: '/settings', icon: Settings },
]
