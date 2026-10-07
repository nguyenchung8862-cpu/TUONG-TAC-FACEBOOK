import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import type { AppUser, MissionTask, Squad } from '../types'

export function exportUsersExcel(users: AppUser[]) {
  const rows = users.map((u) => ({
    'Họ tên': u.name, 'Tài khoản': u.username, 'Vai trò': u.role, 'Tiểu đội': u.squad,
    'Trạng thái': u.active ? 'Hoạt động' : 'Khóa', 'Tỷ lệ hoàn thành': `${u.completionRate ?? 0}%`,
  }))
  const wb = XLSX.utils.book_new(); const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, 'Tai khoan')
  XLSX.writeFile(wb, 'bao-cao-tai-khoan.xlsx')
}

export function exportMissionExcel(task: MissionTask, squads: Squad[]) {
  const rows = squads.map((s) => ({ 'Đơn vị': s.name, 'Quân số': s.memberCount, 'Tiến độ': `${s.completionRate}%`, 'Tiểu đội trưởng': s.leaderName || 'Chưa chỉ định' }))
  const wb = XLSX.utils.book_new(); const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, task.code || 'Nhiem vu')
  XLSX.writeFile(wb, `${task.code || 'nhiem-vu'}-bao-cao.xlsx`)
}

export function exportMissionPdf(task: MissionTask, squads: Squad[]) {
  const doc = new jsPDF()
  doc.setFontSize(16); doc.text('MISSION REPORT', 14, 18)
  doc.setFontSize(11); doc.text(`${task.code || ''} - ${task.title}`, 14, 28)
  doc.text(`Campaign: ${task.campaign}`, 14, 36)
  doc.text(`Deadline: ${task.deadline}`, 14, 44)
  doc.text(`Progress: ${task.completedCount || 0}/${task.totalCount || 0}`, 14, 52)
  let y = 66
  squads.forEach((s) => { doc.text(`${s.code}  ${s.name}  ${s.memberCount} members  ${s.completionRate}%`, 14, y); y += 8 })
  doc.save(`${task.code || 'mission'}-report.pdf`)
}

export async function importUsersFile(file: File): Promise<Partial<AppUser>[]> {
  const data = await file.arrayBuffer(); const wb = XLSX.read(data)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
  return rows.map((r) => ({
    name: String(r['Họ tên'] ?? r['Ho ten'] ?? r['name'] ?? '').trim(),
    username: String(r['Tài khoản'] ?? r['Tai khoan'] ?? r['username'] ?? '').trim(),
    password: String(r['Mật khẩu'] ?? r['Mat khau'] ?? r['password'] ?? '123456'),
    role: String(r['Vai trò'] ?? r['Vai tro'] ?? r['role'] ?? 'soldier').toLowerCase().includes('trưởng') ? 'leader' : String(r['role'] ?? '').toLowerCase() === 'admin' ? 'admin' : 'soldier',
    squad: String(r['Tiểu đội'] ?? r['Tieu doi'] ?? r['squad'] ?? 'Tiểu đội 01'),
    active: true,
  }))
}
