import { useMemo, useState } from 'react'
import { ArrowLeft, Download, ExternalLink, FileText, Heart, MessageCircle, Search, Share2, ShieldAlert, Trash2, UsersRound, X } from 'lucide-react'
import type { AppUser, MissionTask, Squad } from '../types'
import { exportMissionExcel, exportMissionPdf } from '../lib/reports'

export function AdminMissionDetail({ task, squads, users, onBack, onDelete }: { task: MissionTask; squads: Squad[]; users: AppUser[]; onBack: () => void; onDelete: () => void }) {
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null)
  const [query, setQuery] = useState('')
  const total = task.totalCount || 0; const completed = task.completedCount || 0; const pct = total ? Math.round((completed / total) * 100) : 0
  const assigned = useMemo(() => squads.filter((s) => !task.assignedSquadIds?.length || task.assignedSquadIds.includes(s.id)), [squads, task.assignedSquadIds])
  const squadUsers = useMemo(() => users.filter((u) => selectedSquad && u.squadId === selectedSquad.id && `${u.name} ${u.username}`.toLowerCase().includes(query.toLowerCase())), [users, selectedSquad, query])

  return <div className="page-stack mission-admin-detail">
    <button className="inline-back" type="button" onClick={onBack}><ArrowLeft size={17}/> Quay lại danh sách</button>
    <section className="mission-detail-command"><div className="mission-detail-code"><span>MISSION</span><strong>{task.code?.slice(-3) || String(task.id).padStart(3,'0')}</strong></div><div className="mission-detail-copy"><div className="mission-title-line"><span className="military-kicker">HỒ SƠ NHIỆM VỤ</span><span className={`priority-chip ${task.priority || 'normal'}`}>{task.priority === 'urgent' ? 'KHẨN' : task.priority === 'important' ? 'QUAN TRỌNG' : 'THƯỜNG'}</span></div><h1>{task.title}</h1><p>{task.code} · {task.campaign}</p></div></section>
    <section className="mission-detail-grid"><button className="detail-stat-button" type="button"><UsersRound size={18}/><strong>{completed}/{total}</strong><span>ĐÃ HOÀN THÀNH</span></button><button className="detail-stat-button" type="button"><ShieldAlert size={18}/><strong>{pct}%</strong><span>TIẾN ĐỘ</span></button></section>
    <div className="mission-live-progress"><div><span>TIẾN ĐỘ THỜI GIAN THỰC</span><b>{pct}%</b></div><div className="hero-progress"><span style={{ width: `${pct}%` }}/></div><small><i/> Tự cập nhật khi máy chủ nhận báo cáo mới</small></div>
    <section className="mission-detail-sheet"><div className="detail-sheet-row"><span>Trạng thái</span><b>{task.status === 'completed' ? 'HOÀN THÀNH' : task.status === 'overdue' ? 'QUÁ HẠN' : 'ĐANG TRIỂN KHAI'}</b></div><div className="detail-sheet-row"><span>Thời hạn</span><b>{task.deadline}</b></div><div className="detail-sheet-row"><span>Khởi tạo</span><b>{task.createdAt || '—'}</b></div><div className="detail-sheet-row"><span>Người phát lệnh</span><b>{task.createdBy || 'Admin'}</b></div><div className="detail-sheet-row"><span>Yêu cầu</span><b className="requirement-inline">{task.requireLike && <i><Heart size={13}/> Like</i>}{task.requireComment && <i><MessageCircle size={13}/> Comment</i>}{task.requireShare && <i><Share2 size={13}/> Share</i>}</b></div></section>

    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">ĐƠN VỊ TRIỂN KHAI</span><h2>Tiến độ theo tiểu đội</h2></div></div><div className="squad-progress-list">{assigned.map((s) => <button key={s.id} type="button" className="squad-progress-row" onClick={() => setSelectedSquad(s)}><div><strong>{s.code} · {s.name}</strong><span>{s.leaderName || 'Chưa chỉ định trưởng'} · {s.memberCount} quân số</span></div><b>{s.completionRate}%</b><div className="micro-progress"><i style={{ width: `${s.completionRate}%` }}/></div></button>)}</div></section>

    <div className="report-action-grid"><button type="button" onClick={() => exportMissionExcel(task, assigned)}><Download size={16}/> EXCEL</button><button type="button" onClick={() => exportMissionPdf(task, assigned)}><FileText size={16}/> PDF</button></div>
    <a className="facebook-btn" href={task.facebookUrl} target="_blank" rel="noreferrer">Mở bài viết Facebook <ExternalLink size={17}/></a>
    <button className="danger-wide-btn" type="button" onClick={onDelete}><Trash2 size={17}/> XÓA NHIỆM VỤ</button>

    {selectedSquad && <div className="dialog-backdrop" onMouseDown={() => setSelectedSquad(null)}><section className="center-form-modal squad-roster-modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><div><span className="military-kicker">{selectedSquad.code}</span><h3>{selectedSquad.name}</h3></div><button className="dialog-close" type="button" onClick={() => setSelectedSquad(null)}><X size={17}/></button></div><div className="search-command compact"><Search size={15}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm quân số..."/></div><div className="roster-mini-list compact-six-list compact-six-roster">{squadUsers.length ? squadUsers.map((u) => <div key={u.id} className="roster-mini-row"><div className="avatar">{u.name.slice(-1)}</div><div><strong>{u.name}</strong><span>@{u.username} · {u.completionRate ?? 0}%</span></div><span className={(u.completionRate || 0) >= 80 ? 'member-state done' : 'member-state waiting'}>{(u.completionRate || 0) >= 80 ? 'Ổn' : 'Cần nhắc'}</span></div>) : <div className="empty-inline">Chưa có dữ liệu quân số trong bản demo.</div>}</div></section></div>}
  </div>
}
