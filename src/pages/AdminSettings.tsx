import { useMemo, useState } from 'react'
import { Activity, BellRing, CheckCircle2, CloudCog, Download, FileClock, LogOut, RefreshCw, Server, ShieldCheck, Smartphone, Wifi, WifiOff } from 'lucide-react'
import type { AppUser, AuditLog, MissionTask, Squad } from '../types'
import { exportUsersExcel } from '../lib/reports'

export function AdminSettings({ user, users, tasks, squads, logs, online, onLogout, onResetDemo, onInstallApp, pwaInstalled = false }: { user: AppUser; users: AppUser[]; tasks: MissionTask[]; squads: Squad[]; logs: AuditLog[]; online: boolean; onLogout: () => void; onResetDemo: () => void; onInstallApp?: () => Promise<unknown>; pwaInstalled?: boolean }) {
  const [notice, setNotice] = useState('')
  const apiUrl = import.meta.env.VITE_API_URL || 'Chưa cấu hình — đang dùng dữ liệu cục bộ'
  const stats = useMemo(() => ({ active: users.filter((u) => u.active).length, missions: tasks.length, squads: squads.length }), [users, tasks, squads])

  return <div className="page-stack">
    <section className="profile-command-card"><div className="profile-rank"><ShieldCheck size={25}/></div><span className="military-kicker">SYSTEM / COMMAND</span><h1>{user.name}</h1><p>QUẢN TRỊ HỆ THỐNG · Bộ chỉ huy</p></section>

    <section className="system-status-card"><div><span className="military-kicker">TRẠNG THÁI HỆ THỐNG</span><h2>{online ? 'Kết nối sẵn sàng' : 'Đang ngoại tuyến'}</h2></div><div className={online ? 'system-orb online' : 'system-orb offline'}>{online ? <Wifi size={18}/> : <WifiOff size={18}/>}</div><p>{apiUrl}</p></section>

    <section className="admin-summary-grid tactical-summary settings-stats"><button className="summary-tile" type="button"><Activity size={18}/><div><strong>{stats.active}</strong><span>TÀI KHOẢN</span></div></button><button className="summary-tile" type="button"><BellRing size={18}/><div><strong>{stats.missions}</strong><span>NHIỆM VỤ</span></div></button><button className="summary-tile" type="button"><Server size={18}/><div><strong>{stats.squads}</strong><span>ĐƠN VỊ</span></div></button></section>

    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">CÔNG CỤ</span><h2>Vận hành hệ thống</h2></div></div><div className="settings-action-list">
      <button type="button" onClick={() => { exportUsersExcel(users); setNotice('Đã xuất báo cáo tài khoản Excel.') }}><Download size={17}/><div><strong>Xuất danh sách tài khoản</strong><span>Tải báo cáo .xlsx về máy</span></div></button>
      <button type="button" onClick={() => { if (pwaInstalled) { setNotice('Ứng dụng đã được cài trên thiết bị này.'); return } if (onInstallApp) void onInstallApp(); else setNotice('Mở menu trình duyệt và chọn Thêm vào màn hình chính.') }}><Smartphone size={17}/><div><strong>{pwaInstalled ? 'Ứng dụng đã được cài' : 'Cài ứng dụng PWA'}</strong><span>{pwaInstalled ? 'Đang chạy ở chế độ ứng dụng độc lập' : 'Thêm biểu tượng ra màn hình chính'}</span></div></button>
      <button type="button" onClick={() => setNotice(`API máy chủ: ${apiUrl}`)}><CloudCog size={17}/><div><strong>Kết nối máy chủ laptop</strong><span>Kiểm tra URL API và trạng thái mạng</span></div></button>
      <button type="button" onClick={onResetDemo}><RefreshCw size={17}/><div><strong>Khôi phục dữ liệu mẫu</strong><span>Đưa dữ liệu demo về trạng thái ban đầu</span></div></button>
    </div></section>

    {notice && <div className="form-message success"><CheckCircle2 size={16}/>{notice}</div>}

    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">AUDIT LOG</span><h2>Nhật ký tác nghiệp</h2></div><span className="live-chip"><FileClock size={12}/> LIVE</span></div><div className="audit-list compact-six-scroll">{logs.map((log) => <div className={`audit-row ${log.level}`} key={log.id}><span className="audit-dot"/><div><strong>{log.action}</strong><p>{log.detail}</p><small>{log.actor} · {log.time}</small></div></div>)}</div></section>

    <button className="danger-wide-btn" type="button" onClick={onLogout}><LogOut size={17}/> ĐĂNG XUẤT HỆ THỐNG</button>
  </div>
}
