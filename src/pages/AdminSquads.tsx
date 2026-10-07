import { useMemo, useState } from 'react'
import { ChevronRight, Edit3, Plus, Search, ShieldCheck, Trash2, UserRound, UsersRound, X } from 'lucide-react'
import type { AppUser, Squad } from '../types'
import { ConfirmDialog } from '../components/ConfirmDialog'

type Props = {
  squads: Squad[]
  users: AppUser[]
  onCreate: (squad: Squad) => void
  onUpdate: (squad: Squad) => void
  onDelete: (id: number) => void
}

export function AdminSquads({ squads, users, onCreate, onUpdate, onDelete }: Props) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Squad | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Squad | null>(null)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [leaderId, setLeaderId] = useState<number | undefined>()
  const leaders = users.filter((u) => u.role === 'leader' && u.active)

  const filtered = useMemo(() => squads.filter((s) => `${s.code} ${s.name} ${s.leaderName || ''}`.toLowerCase().includes(query.toLowerCase())), [squads, query])

  const openNew = () => { setEditing(null); setName(`Tiểu đội ${String(squads.length + 1).padStart(2, '0')}`); setCode(`TĐ-${String(squads.length + 1).padStart(2, '0')}`); setLeaderId(undefined); setShowForm(true) }
  const openEdit = (s: Squad) => { setEditing(s); setName(s.name); setCode(s.code); setLeaderId(s.leaderId); setShowForm(true) }
  const save = () => {
    if (!name.trim() || !code.trim()) return
    const leader = leaders.find((u) => u.id === leaderId)
    const value: Squad = editing ? { ...editing, name: name.trim(), code: code.trim(), leaderId, leaderName: leader?.name } : { id: Date.now(), name: name.trim(), code: code.trim(), leaderId, leaderName: leader?.name, memberCount: 0, active: true, completionRate: 0 }
    editing ? onUpdate(value) : onCreate(value)
    setShowForm(false)
  }

  return <div className="page-stack">
    <section className="ops-title-card"><div className="ops-title-icon"><ShieldCheck size={21}/></div><div><span className="military-kicker">ĐƠN VỊ TRỰC THUỘC</span><h1>Quản lý tiểu đội</h1><p>Tạo đơn vị, chỉ định tiểu đội trưởng và theo dõi quân số.</p></div><button className="square-plus" type="button" onClick={openNew}><Plus size={20}/></button></section>

    <div className="search-command"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm tiểu đội hoặc tiểu đội trưởng..." /></div>

    <section className="squad-grid-list">
      {filtered.map((squad) => <button className="squad-command-card" type="button" key={squad.id} onClick={() => openEdit(squad)}>
        <div className="squad-card-top"><span className="squad-code">{squad.code}</span><span className={squad.active ? 'live-chip' : 'offline-chip'}>{squad.active ? 'HOẠT ĐỘNG' : 'TẠM DỪNG'}</span></div>
        <strong>{squad.name}</strong><span className="squad-leader"><UserRound size={13}/>{squad.leaderName || 'Chưa chỉ định tiểu đội trưởng'}</span>
        <div className="squad-metrics"><span><UsersRound size={14}/><b>{squad.memberCount}</b> quân số</span><span><b>{squad.completionRate}%</b> tiến độ</span></div>
        <div className="micro-progress"><i style={{ width: `${squad.completionRate}%` }} /></div><ChevronRight size={16} className="squad-chevron"/>
      </button>)}
    </section>

    {showForm && <div className="dialog-backdrop" onMouseDown={() => setShowForm(false)}><section className="center-form-modal" onMouseDown={(e) => e.stopPropagation()}>
      <div className="modal-head"><div><span className="military-kicker">{editing ? 'HIỆU CHỈNH ĐƠN VỊ' : 'THÀNH LẬP ĐƠN VỊ'}</span><h3>{editing ? editing.name : 'Tiểu đội mới'}</h3></div><button type="button" className="dialog-close" onClick={() => setShowForm(false)}><X size={17}/></button></div>
      <label className="military-field"><span>MÃ TIỂU ĐỘI</span><input value={code} onChange={(e) => setCode(e.target.value)} /></label>
      <label className="military-field"><span>TÊN TIỂU ĐỘI</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="military-field"><span>TIỂU ĐỘI TRƯỞNG</span><div className="select-wrap"><select value={leaderId || ''} onChange={(e) => setLeaderId(e.target.value ? Number(e.target.value) : undefined)}><option value="">Chưa chỉ định</option>{leaders.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div></label>
      <button className="primary-btn" type="button" onClick={save}><Edit3 size={17}/>{editing ? 'LƯU THAY ĐỔI' : 'TẠO TIỂU ĐỘI'}</button>
      {editing && <button className="danger-wide-btn" type="button" onClick={() => { setShowForm(false); setDeleteTarget(editing) }}><Trash2 size={17}/> XÓA TIỂU ĐỘI</button>}
    </section></div>}

    <ConfirmDialog open={Boolean(deleteTarget)} title="Xóa tiểu đội này?" description={deleteTarget ? `${deleteTarget.name} sẽ bị xóa khỏi danh sách đơn vị. Các tài khoản thuộc đơn vị cần được gán lại sau đó.` : ''} confirmLabel="XÓA TIỂU ĐỘI" onCancel={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) onDelete(deleteTarget.id); setDeleteTarget(null) }}/>
  </div>
}
