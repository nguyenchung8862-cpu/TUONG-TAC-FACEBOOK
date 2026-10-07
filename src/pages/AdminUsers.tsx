import { useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, ChevronRight, Download, FileSpreadsheet, KeyRound, Plus, Search, ShieldCheck, Trash2, UserPlus, UserRound, UsersRound, X } from 'lucide-react'
import type { AppUser, Role, Squad } from '../types'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { exportUsersExcel, importUsersFile } from '../lib/reports'
import { api } from '../lib/api'

type Props = {
  users: AppUser[]
  squads: Squad[]
  currentUserId: number
  onCreateUser: (input: Omit<AppUser, 'id' | 'active'>) => boolean
  onBulkCreate: (inputs: Omit<AppUser, 'id' | 'active'>[]) => number
  onDeleteUser: (id: number) => void
  onToggleActive: (id: number) => void
}

const roleLabel: Record<Role, string> = { admin: 'Admin', leader: 'Tiểu đội trưởng', soldier: 'Chiến sĩ' }

export function AdminUsers({ users, squads, currentUserId, onCreateUser, onBulkCreate, onDeleteUser, onToggleActive }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('123456')
  const [role, setRole] = useState<Role>('soldier')
  const [squad, setSquad] = useState(squads[0]?.name || 'Tiểu đội 01')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'leader' | 'soldier'>('all')
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const counts = useMemo(() => ({ total: users.length, leaders: users.filter((u) => u.role === 'leader').length, soldiers: users.filter((u) => u.role === 'soldier').length }), [users])
  const filteredUsers = useMemo(() => users.filter((user) => (roleFilter === 'all' || user.role === roleFilter) && `${user.name} ${user.username} ${user.squad}`.toLowerCase().includes(query.toLowerCase())), [users, roleFilter, query])

  const reset = () => { setName(''); setUsername(''); setPassword('123456'); setRole('soldier'); setSquad(squads[0]?.name || 'Tiểu đội 01'); setError('') }
  const create = () => {
    setError(''); setMessage('')
    if (!name.trim() || !username.trim() || !password.trim()) { setError('Vui lòng nhập đủ họ tên, tài khoản và mật khẩu.'); return }
    const squadObj = squads.find((s) => s.name === squad)
    const ok = onCreateUser({ name: name.trim(), username: username.trim(), password, role, squad: role === 'admin' ? 'Bộ chỉ huy' : squad, squadId: role === 'admin' ? undefined : squadObj?.id, rank: role === 'admin' ? 'Quản trị' : role === 'leader' ? 'Tiểu đội trưởng' : 'Chiến sĩ', lastSeen: 'Chưa đăng nhập', completedMissions: 0, completionRate: 0 })
    if (!ok) { setError('Tên đăng nhập này đã tồn tại.'); return }
    setMessage(`Đã tạo tài khoản ${username.trim()} thành công.`); reset(); setShowForm(false)
  }

  const importFile = async (file?: File) => {
    if (!file) return
    try {
      const rows = await importUsersFile(file)
      const clean = rows.filter((r) => r.name && r.username).map((r) => ({ name: r.name!, username: r.username!, password: r.password || '123456', role: (r.role || 'soldier') as Role, squad: r.role === 'admin' ? 'Bộ chỉ huy' : (r.squad || squads[0]?.name || 'Tiểu đội 01'), squadId: squads.find((s) => s.name === r.squad)?.id, rank: r.role === 'leader' ? 'Tiểu đội trưởng' : r.role === 'admin' ? 'Quản trị' : 'Chiến sĩ', lastSeen: 'Chưa đăng nhập', completedMissions: 0, completionRate: 0 }))
      const added = onBulkCreate(clean)
      setMessage(`Đã nhập ${added}/${clean.length} tài khoản từ file.`)
    } catch { setError('Không đọc được file. Hãy dùng .xlsx, .xls hoặc .csv đúng định dạng.') }
    if (fileRef.current) fileRef.current.value = ''
  }

  return <div className="page-stack admin-users-page">
    <section className="admin-users-hero clickable-surface" onClick={() => setShowForm(true)}><div className="admin-users-icon"><UsersRound size={22}/></div><div><span className="section-kicker">QUẢN LÝ QUÂN SỐ</span><h1>Tài khoản hệ thống</h1><p>Tạo, nhập Excel, khóa và xóa tài khoản.</p></div><ChevronRight size={18}/></section>

    <section className="account-stat-grid"><button className={roleFilter === 'all' ? 'selected' : ''} type="button" onClick={() => setRoleFilter('all')}><strong>{counts.total}</strong><span>Tổng tài khoản</span></button><button className={roleFilter === 'leader' ? 'selected' : ''} type="button" onClick={() => setRoleFilter('leader')}><strong>{counts.leaders}</strong><span>Tiểu đội trưởng</span></button><button className={roleFilter === 'soldier' ? 'selected' : ''} type="button" onClick={() => setRoleFilter('soldier')}><strong>{counts.soldiers}</strong><span>Chiến sĩ</span></button></section>

    <div className="search-command"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm họ tên, tài khoản, tiểu đội..."/></div>
    <div className="dual-action-row"><button className="admin-create-user-btn" type="button" onClick={() => { setShowForm((v) => !v); setMessage('') }}><span><UserPlus size={18}/> TẠO TÀI KHOẢN</span>{showForm ? <X size={17}/> : <Plus size={17}/>}</button><button className="mini-command-btn" type="button" onClick={() => fileRef.current?.click()}><FileSpreadsheet size={17}/><span>NHẬP EXCEL</span></button><button className="mini-command-btn" type="button" onClick={() => exportUsersExcel(users)}><Download size={17}/><span>XUẤT</span></button><input ref={fileRef} hidden type="file" accept=".xlsx,.xls,.csv" onChange={(e) => importFile(e.target.files?.[0])}/></div>

    {showForm && <section className="user-create-card"><div className="form-title-row"><div className="form-title-icon"><ShieldCheck size={18}/></div><div><strong>Cấp tài khoản</strong><span>Thiết lập thông tin đăng nhập</span></div></div>
      <label className="admin-form-label"><span>Họ và tên</span><div className="admin-input"><UserRound size={17}/><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Nguyễn Văn A"/></div></label>
      <label className="admin-form-label"><span>Tên đăng nhập</span><div className="admin-input"><UserRound size={17}/><input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))} placeholder="nguyenvana"/></div></label>
      <label className="admin-form-label"><span>Mật khẩu ban đầu</span><div className="admin-input"><KeyRound size={17}/><input value={password} onChange={(e) => setPassword(e.target.value)}/></div></label>
      <div className="admin-form-grid"><label className="admin-form-label"><span>Vai trò</span><div className="admin-select"><select value={role} onChange={(e) => setRole(e.target.value as Role)}><option value="soldier">Chiến sĩ</option><option value="leader">Tiểu đội trưởng</option><option value="admin">Admin</option></select><ChevronDown size={16}/></div></label><label className="admin-form-label"><span>Đơn vị</span><div className="admin-select"><select value={squad} onChange={(e) => setSquad(e.target.value)} disabled={role === 'admin'}>{squads.map((s) => <option key={s.id}>{s.name}</option>)}</select><ChevronDown size={16}/></div></label></div>
      {error && <div className="form-message error">{error}</div>}<button className="primary-btn" type="button" onClick={create}><UserPlus size={18}/> TẠO TÀI KHOẢN</button></section>}
    {message && <div className="form-message success"><Check size={16}/>{message}</div>}

    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">DANH SÁCH</span><h2>{filteredUsers.length} tài khoản</h2></div></div><div className="account-list compact-six-list compact-six-accounts">{filteredUsers.map((user) => <button className="account-row account-row-button" type="button" key={user.id} onClick={() => setSelectedUser(user)}><div className={`account-avatar ${user.role} ${user.avatarUrl ? 'has-photo' : ''}`}>{user.avatarUrl ? <img src={api.resolveAsset(user.avatarUrl)} alt={user.name}/> : (user.name.split(' ').slice(-1)[0]?.slice(0,1) || 'U')}</div><div className="account-main"><strong>{user.name}</strong><span>@{user.username} · {user.squad} · {user.active ? 'Hoạt động' : 'Đã khóa'}</span></div><div className={`role-chip ${user.role}`}>{roleLabel[user.role]}</div><ChevronRight size={15}/></button>)}</div></section>

    {selectedUser && createPortal(<div className="dialog-backdrop account-modal-backdrop" onMouseDown={() => setSelectedUser(null)}><section className="account-detail-sheet account-modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}><div className="account-modal-body"><div className="sheet-grip"/><div className="account-detail-head"><div className={`account-avatar ${selectedUser.role} ${selectedUser.avatarUrl ? 'has-photo' : ''}`}>{selectedUser.avatarUrl ? <img src={api.resolveAsset(selectedUser.avatarUrl)} alt={selectedUser.name}/> : selectedUser.name.slice(-1)}</div><div><span className="section-kicker">HỒ SƠ TÀI KHOẢN</span><h3>{selectedUser.name}</h3><p>@{selectedUser.username} · {selectedUser.squad}</p></div><button type="button" className="dialog-close" onClick={() => setSelectedUser(null)}><X size={17}/></button></div><div className="account-detail-grid"><div><span>VAI TRÒ</span><strong>{roleLabel[selectedUser.role]}</strong></div><div><span>HOÀN THÀNH</span><strong>{selectedUser.completionRate ?? 0}%</strong></div><div><span>NHIỆM VỤ</span><strong>{selectedUser.completedMissions ?? 0}</strong></div><div><span>HOẠT ĐỘNG</span><strong>{selectedUser.lastSeen || '—'}</strong></div></div></div><div className="account-modal-footer">{selectedUser.id === currentUserId ? <div className="self-account-note"><ShieldCheck size={15}/> Không thể thao tác tài khoản đang đăng nhập.</div> : <><button className="secondary-action" type="button" onClick={() => { onToggleActive(selectedUser.id); setSelectedUser({ ...selectedUser, active: !selectedUser.active }) }}>{selectedUser.active ? 'KHÓA TÀI KHOẢN' : 'MỞ KHÓA TÀI KHOẢN'}</button><button className="danger-wide-btn" type="button" onClick={() => { setDeleteTarget(selectedUser); setSelectedUser(null) }}><Trash2 size={17}/> XÓA TÀI KHOẢN</button></>}</div></section></div>, document.body)}

    <ConfirmDialog open={Boolean(deleteTarget)} title="Xóa tài khoản này?" description={deleteTarget ? `Tài khoản @${deleteTarget.username} sẽ bị xóa khỏi hệ thống.` : ''} confirmLabel="XÓA TÀI KHOẢN" onCancel={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) onDeleteUser(deleteTarget.id); setDeleteTarget(null) }}/>
  </div>
}
