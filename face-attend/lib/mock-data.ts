export type AttendanceStatus = 'on-time' | 'late' | 'absent' | 'not-checked' | 'early-leave'

export type Employee = {
  id: string
  code: string
  name: string
  email: string
  phone: string
  department: string
  branch: string
  position: string
  startDate: string
  status: 'active' | 'inactive'
  faceRegistered: boolean
  faceSamples: number
  faceUpdated?: string
}

export const departments = [
  { id: 'it', name: 'IT', manager: 'Nguyễn Văn An', employees: 42, rate: 91.2 },
  { id: 'hr', name: 'HR', manager: 'Trần Minh Bình', employees: 18, rate: 88.5 },
  { id: 'sales', name: 'Sales', manager: 'Lê Hoàng Nam', employees: 65, rate: 84.7 },
  { id: 'marketing', name: 'Marketing', manager: 'Phạm Thu Hà', employees: 34, rate: 86.9 },
  { id: 'accounting', name: 'Accounting', manager: 'Vũ Quốc Đạt', employees: 21, rate: 93.4 },
]

export const branches = [
  { id: 'hn', name: 'Trụ sở chính', city: 'Hà Nội', address: '180 Nguyễn Trãi, Thanh Xuân, Hà Nội', employees: 180, devices: 12 },
  { id: 'dn', name: 'Chi nhánh Đà Nẵng', city: 'Đà Nẵng', address: '45 Nguyễn Văn Linh, Hải Châu, Đà Nẵng', employees: 45, devices: 4 },
  { id: 'hcm', name: 'Chi nhánh TP.HCM', city: 'TP.HCM', address: '236 Lê Văn Sỹ, Quận 3, TP.HCM', employees: 72, devices: 6 },
]

export const employees: Employee[] = [
  { id: '1', code: 'NV001', name: 'Nguyễn Văn An', email: 'an.nguyen@abc.com', phone: '0901234567', department: 'IT', branch: 'Hà Nội', position: 'Developer', startDate: '15/03/2021', status: 'active', faceRegistered: true, faceSamples: 5, faceUpdated: '09/09/2026' },
  { id: '2', code: 'NV002', name: 'Trần Minh Bình', email: 'binh.tran@abc.com', phone: '0912345678', department: 'HR', branch: 'Hà Nội', position: 'HR Executive', startDate: '02/06/2020', status: 'active', faceRegistered: false, faceSamples: 0 },
  { id: '3', code: 'NV003', name: 'Lê Hoàng Nam', email: 'nam.le@abc.com', phone: '0923456789', department: 'Sales', branch: 'TP.HCM', position: 'Sales Manager', startDate: '20/01/2019', status: 'active', faceRegistered: true, faceSamples: 6, faceUpdated: '01/09/2026' },
  { id: '4', code: 'NV004', name: 'Phạm Thu Hà', email: 'ha.pham@abc.com', phone: '0934567890', department: 'Marketing', branch: 'Hà Nội', position: 'Marketing Lead', startDate: '11/11/2021', status: 'active', faceRegistered: true, faceSamples: 4, faceUpdated: '28/08/2026' },
  { id: '5', code: 'NV005', name: 'Vũ Quốc Đạt', email: 'dat.vu@abc.com', phone: '0945678901', department: 'Accounting', branch: 'Hà Nội', position: 'Kế toán trưởng', startDate: '05/09/2018', status: 'active', faceRegistered: true, faceSamples: 5, faceUpdated: '30/08/2026' },
  { id: '6', code: 'NV006', name: 'Đặng Thị Mai', email: 'mai.dang@abc.com', phone: '0956789012', department: 'Sales', branch: 'Đà Nẵng', position: 'Sales Executive', startDate: '19/07/2022', status: 'active', faceRegistered: true, faceSamples: 5, faceUpdated: '02/09/2026' },
  { id: '7', code: 'NV007', name: 'Bùi Tiến Dũng', email: 'dung.bui@abc.com', phone: '0967890123', department: 'IT', branch: 'Hà Nội', position: 'DevOps Engineer', startDate: '23/02/2023', status: 'active', faceRegistered: false, faceSamples: 0 },
  { id: '8', code: 'NV008', name: 'Hoàng Thị Lan', email: 'lan.hoang@abc.com', phone: '0978901234', department: 'Marketing', branch: 'TP.HCM', position: 'Content Writer', startDate: '14/05/2022', status: 'active', faceRegistered: true, faceSamples: 5, faceUpdated: '05/09/2026' },
  { id: '9', code: 'NV009', name: 'Ngô Văn Hùng', email: 'hung.ngo@abc.com', phone: '0989012345', department: 'IT', branch: 'Hà Nội', position: 'QA Engineer', startDate: '08/08/2021', status: 'active', faceRegistered: true, faceSamples: 4, faceUpdated: '06/09/2026' },
  { id: '10', code: 'NV010', name: 'Đỗ Thị Hồng', email: 'hong.do@abc.com', phone: '0990123456', department: 'HR', branch: 'Đà Nẵng', position: 'Tuyển dụng', startDate: '17/10/2020', status: 'inactive', faceRegistered: true, faceSamples: 5, faceUpdated: '20/07/2026' },
  { id: '11', code: 'NV011', name: 'Trịnh Công Sơn', email: 'son.trinh@abc.com', phone: '0901112233', department: 'Sales', branch: 'TP.HCM', position: 'Sales Executive', startDate: '29/03/2023', status: 'active', faceRegistered: true, faceSamples: 5, faceUpdated: '07/09/2026' },
  { id: '12', code: 'NV012', name: 'Lý Thị Thu', email: 'thu.ly@abc.com', phone: '0902223344', department: 'Accounting', branch: 'Hà Nội', position: 'Kế toán', startDate: '12/12/2021', status: 'active', faceRegistered: false, faceSamples: 0 },
]

export type TodayRecord = {
  employeeId: string
  name: string
  department: string
  checkIn: string | null
  checkOut: string | null
  status: AttendanceStatus
}

export const todayAttendance: TodayRecord[] = [
  { employeeId: '1', name: 'Nguyễn Văn An', department: 'IT', checkIn: '07:58', checkOut: '17:05', status: 'on-time' },
  { employeeId: '2', name: 'Trần Minh Bình', department: 'HR', checkIn: '08:12', checkOut: null, status: 'late' },
  { employeeId: '3', name: 'Lê Hoàng Nam', department: 'Sales', checkIn: '07:55', checkOut: '17:02', status: 'on-time' },
  { employeeId: '4', name: 'Phạm Thu Hà', department: 'Marketing', checkIn: null, checkOut: null, status: 'not-checked' },
  { employeeId: '5', name: 'Vũ Quốc Đạt', department: 'Accounting', checkIn: '07:49', checkOut: '17:10', status: 'on-time' },
  { employeeId: '6', name: 'Đặng Thị Mai', department: 'Sales', checkIn: '08:05', checkOut: '16:40', status: 'late' },
  { employeeId: '9', name: 'Ngô Văn Hùng', department: 'IT', checkIn: '07:52', checkOut: '17:00', status: 'on-time' },
]

export const dashboardStats = {
  totalEmployees: 250,
  checkedInToday: 218,
  late: 12,
  notChecked: 20,
  attendanceRate: 87.2,
}

export const weeklyAttendance = {
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  present: [232, 228, 235, 218, 240, 96, 42],
  late: [10, 14, 8, 12, 6, 4, 2],
}

export const recentActivity = [
  { id: 1, name: 'Nguyễn Văn An', action: 'đã điểm danh vào', time: '07:58', ago: '2 phút trước' },
  { id: 2, name: 'Lê Hoàng Nam', action: 'đã điểm danh vào', time: '07:55', ago: '5 phút trước' },
  { id: 3, name: 'Trần Minh Bình', action: 'điểm danh trễ', time: '08:12', ago: '8 phút trước' },
  { id: 4, name: 'Vũ Quốc Đạt', action: 'đã điểm danh vào', time: '07:49', ago: '14 phút trước' },
  { id: 5, name: 'Đặng Thị Mai', action: 'đã đăng ký khuôn mặt mới', time: '07:40', ago: '23 phút trước' },
]

export type HistoryRecord = {
  id: string
  date: string
  employeeId: string
  name: string
  department: string
  checkIn: string | null
  checkOut: string | null
  worked: string
  status: AttendanceStatus
}

const names = employees.map((e) => ({ id: e.id, name: e.name, department: e.department }))
export const attendanceHistory: HistoryRecord[] = Array.from({ length: 48 }).map((_, i) => {
  const person = names[i % names.length]
  const day = 10 - Math.floor(i / names.length)
  const statuses: AttendanceStatus[] = ['on-time', 'on-time', 'on-time', 'late', 'early-leave', 'absent']
  const status = statuses[i % statuses.length]
  const checkIn = status === 'absent' ? null : status === 'late' ? '08:14' : '07:56'
  const checkOut = status === 'absent' ? null : status === 'early-leave' ? '16:20' : '17:04'
  const worked = status === 'absent' ? '0h' : status === 'early-leave' ? '7h 26m' : '8h 08m'
  return {
    id: `H${i + 1}`,
    date: `${String(day).padStart(2, '0')}/09/2026`,
    employeeId: person.id,
    name: person.name,
    department: person.department,
    checkIn,
    checkOut,
    worked,
    status,
  }
})

export const historyStats = {
  total: 5281,
  onTime: 4842,
  late: 128,
  earlyLeave: 43,
  absent: 76,
}

export const shifts = [
  { id: 'admin', name: 'Ca hành chính', start: '08:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00', lateAllowance: 10, employees: 186, color: 'var(--color-chart-1)' },
  { id: 'morning', name: 'Ca sáng', start: '06:00', end: '14:00', breakStart: '10:00', breakEnd: '10:30', lateAllowance: 5, employees: 34, color: 'var(--color-chart-2)' },
  { id: 'afternoon', name: 'Ca chiều', start: '14:00', end: '22:00', breakStart: '18:00', breakEnd: '18:30', lateAllowance: 5, employees: 30, color: 'var(--color-chart-3)' },
]

export type Device = {
  id: string
  name: string
  camId: string
  location: string
  branch: string
  status: 'online' | 'offline'
  lastActive: string
}

export const devices: Device[] = [
  { id: '1', name: 'Camera 01', camId: 'CAM-001', location: 'Cổng chính', branch: 'Trụ sở chính', status: 'online', lastActive: 'Vừa xong' },
  { id: '2', name: 'Camera 02', camId: 'CAM-002', location: 'Cổng phụ', branch: 'Trụ sở chính', status: 'online', lastActive: '1 phút trước' },
  { id: '3', name: 'Camera 03', camId: 'CAM-003', location: 'Sảnh tầng 1', branch: 'Chi nhánh TP.HCM', status: 'offline', lastActive: '3 giờ trước' },
  { id: '4', name: 'Camera 04', camId: 'CAM-004', location: 'Cổng chính', branch: 'Chi nhánh Đà Nẵng', status: 'online', lastActive: 'Vừa xong' },
  { id: '5', name: 'Camera 05', camId: 'CAM-005', location: 'Bãi đỗ xe', branch: 'Trụ sở chính', status: 'online', lastActive: '2 phút trước' },
  { id: '6', name: 'Camera 06', camId: 'CAM-006', location: 'Sảnh tầng 2', branch: 'Chi nhánh TP.HCM', status: 'offline', lastActive: '1 ngày trước' },
]

export const roles = [
  { id: 'super', name: 'Super Admin', description: 'Toàn quyền hệ thống, quản lý nhiều công ty', members: 2, color: 'var(--color-chart-4)' },
  { id: 'company', name: 'Company Admin', description: 'Quản trị toàn bộ công ty', members: 3, color: 'var(--color-chart-1)' },
  { id: 'hr', name: 'HR Manager', description: 'Quản lý nhân sự & chấm công', members: 5, color: 'var(--color-chart-2)' },
  { id: 'manager', name: 'Department Manager', description: 'Quản lý phòng ban phụ trách', members: 12, color: 'var(--color-chart-3)' },
  { id: 'employee', name: 'Employee', description: 'Nhân viên điểm danh cá nhân', members: 228, color: 'var(--color-chart-5)' },
]

export const permissionMatrix = {
  columns: ['Xem NV', 'Sửa NV', 'Điểm danh', 'Báo cáo', 'Cài đặt'],
  rows: [
    { role: 'Super Admin', perms: [true, true, true, true, true] },
    { role: 'Company Admin', perms: [true, true, true, true, true] },
    { role: 'HR Manager', perms: [true, true, true, true, false] },
    { role: 'Department Manager', perms: [true, false, true, true, false] },
    { role: 'Employee', perms: [false, false, true, false, false] },
  ],
}

export const reportSummary = {
  totalWorkdays: 5281,
  late: 128,
  absent: 76,
  earlyLeave: 43,
  overtime: 231,
}

export const departmentRates = [
  { label: 'IT', value: 91.2, color: 'var(--color-chart-1)' },
  { label: 'Accounting', value: 93.4, color: 'var(--color-chart-2)' },
  { label: 'HR', value: 88.5, color: 'var(--color-chart-3)' },
  { label: 'Marketing', value: 86.9, color: 'var(--color-chart-5)' },
  { label: 'Sales', value: 84.7, color: 'var(--color-chart-4)' },
]

export const monthlyRate = {
  labels: ['01', '05', '10', '15', '20', '25', '30'],
  values: [88, 91, 87, 93, 89, 92, 90],
}

export const monthlyLate = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
  values: [22, 18, 25, 19, 24, 20],
}

export const currentUser = {
  name: 'Nguyễn Văn Admin',
  role: 'Company Admin',
  company: 'ABC Technology',
  email: 'admin@abc.com',
}
