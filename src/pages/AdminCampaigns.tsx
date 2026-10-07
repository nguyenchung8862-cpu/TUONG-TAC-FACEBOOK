import { useMemo, useState, type FormEvent } from 'react'
import { Check, ChevronDown, ChevronRight, Clock3, ExternalLink, FilePlus2, Heart, MessageCircle, Plus, Search, Share2, Shield, Star, Trash2, X } from 'lucide-react'
import type { MissionTask, Priority, Squad } from '../types'
import { ConfirmDialog } from '../components/ConfirmDialog'

type Props = {
  tasks: MissionTask[]
  squads: Squad[]
  showCreate: boolean
  onRequestCreate: () => void
  onCancelCreate: () => void
  onCreate: (task: MissionTask) => void
  onOpenMission: (task: MissionTask) => void
  onDeleteTask: (id: number) => void
}

export function AdminCampaigns({ tasks, squads, showCreate, onRequestCreate, onCancelCreate, onCreate, onOpenMission, onDeleteTask }: Props) {
  const [title, setTitle] = useState('')
  const [campaign, setCampaign] = useState('Chiến dịch truyền thông')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [assigned, setAssigned] = useState<number[]>(squads.map((s) => s.id))
  const [requireLike, setRequireLike] = useState(true)
  const [requireComment, setRequireComment] = useState(true)
  const [requireShare, setRequireShare] = useState(false)
  const [message, setMessage] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<MissionTask | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'completed'>('all')

  const running = useMemo(() => tasks.filter((task) => task.status !== 'completed'), [tasks])
  const filtered = useMemo(() => tasks.filter((task) => {
    const okStatus = status === 'all' || (status === 'completed' ? task.status === 'completed' : task.status !== 'completed')
    const okQuery = `${task.code || ''} ${task.title} ${task.campaign}`.toLowerCase().includes(query.toLowerCase())
    return okStatus && okQuery
  }), [tasks, query, status])

  const submit = (event: FormEvent) => {
    event.preventDefault(); setMessage('')
    if (!title.trim() || !facebookUrl.trim() || !deadline.trim()) { setMessage('Vui lòng nhập tên nhiệm vụ, link Facebook và thời hạn.'); return }
    if (!/^https?:\/\//i.test(facebookUrl.trim())) { setMessage('Link Facebook phải bắt đầu bằng http:// hoặc https://'); return }
    const code = `NV-${new Date().getFullYear()}-${String(tasks.length + 1).padStart(3, '0')}`
    const totalCount = squads.filter((s) => assigned.includes(s.id)).reduce((sum, s) => sum + s.memberCount, 0)
    onCreate({ id: Date.now(), code, title: title.trim(), campaign: campaign.trim() || 'Chiến dịch truyền thông', deadline: deadline.trim(), facebookUrl: facebookUrl.trim(), requireLike, requireComment, requireShare, status: 'in_progress', priority, completedCount: 0, totalCount, createdAt: new Date().toLocaleString('vi-VN'), createdBy: 'Quản trị hệ thống', assignedSquadIds: assigned })
    setTitle(''); setFacebookUrl(''); setDeadline(''); setPriority('normal'); setRequireLike(true); setRequireComment(true); setRequireShare(false)
  }

  const toggleSquad = (id: number) => setAssigned((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return <div className="page-stack admin-campaign-page">
    <section className="ops-title-card clickable-surface" onClick={() => !showCreate && onRequestCreate()}><div className="ops-title-icon"><Shield size={21}/><Star size={9} fill="currentColor"/></div><div><span className="military-kicker">OPS / MISSION CONTROL</span><h1>Quản lý chiến dịch</h1><p>{running.length} nhiệm vụ đang triển khai · {tasks.length} nhiệm vụ trong hệ thống</p></div>{!showCreate && <button className="square-plus" type="button" onClick={(e) => { e.stopPropagation(); onRequestCreate() }}><Plus size={20}/></button>}</section>

    {showCreate && <form className="mission-order-form" onSubmit={submit}><div className="mission-form-head"><div className="mission-form-badge"><FilePlus2 size={18}/></div><div><span>LỆNH TÁC NGHIỆP MỚI</span><strong>Tạo nhiệm vụ Facebook</strong></div><button type="button" className="form-close" onClick={onCancelCreate}><X size={17}/></button></div>
      <label className="military-field"><span>MÃ / TÊN NHIỆM VỤ</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Tương tác bài tuyên truyền 08/10"/></label>
      <div className="admin-form-grid"><label className="military-field"><span>CHIẾN DỊCH</span><div className="select-wrap"><select value={campaign} onChange={(e) => setCampaign(e.target.value)}><option>Chiến dịch truyền thông</option><option>Nhiệm vụ tuần</option><option>Truyền thông đơn vị</option><option>Nhiệm vụ khẩn</option></select><ChevronDown size={15}/></div></label><label className="military-field"><span>MỨC ĐỘ</span><div className="select-wrap"><select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}><option value="normal">THƯỜNG</option><option value="important">QUAN TRỌNG</option><option value="urgent">KHẨN</option></select><ChevronDown size={15}/></div></label></div>
      <label className="military-field"><span>ĐƯỜNG DẪN FACEBOOK</span><div className="field-with-icon"><ExternalLink size={15}/><input value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="https://facebook.com/..."/></div></label>
      <label className="military-field"><span>THỜI HẠN</span><div className="field-with-icon"><Clock3 size={15}/><input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="VD: 17:00 · 08/10/2026"/></div></label>
      <div className="mission-requirements"><span className="military-field-title">YÊU CẦU TƯƠNG TÁC</span><button type="button" className={requireLike ? 'req-toggle active' : 'req-toggle'} onClick={() => setRequireLike(!requireLike)}><Heart size={16}/> LIKE {requireLike && <Check size={14}/>}</button><button type="button" className={requireComment ? 'req-toggle active' : 'req-toggle'} onClick={() => setRequireComment(!requireComment)}><MessageCircle size={16}/> BÌNH LUẬN {requireComment && <Check size={14}/>}</button><button type="button" className={requireShare ? 'req-toggle active' : 'req-toggle'} onClick={() => setRequireShare(!requireShare)}><Share2 size={16}/> CHIA SẺ {requireShare && <Check size={14}/>}</button></div>
      <div className="mission-requirements"><span className="military-field-title">ĐƠN VỊ TRIỂN KHAI</span><div className="squad-chip-grid">{squads.map((s) => <button type="button" key={s.id} className={assigned.includes(s.id) ? 'squad-select-chip active' : 'squad-select-chip'} onClick={() => toggleSquad(s.id)}>{s.code}{assigned.includes(s.id) && <Check size={12}/>}</button>)}</div></div>
      {message && <div className="form-message error">{message}</div>}<button className="primary-btn" type="submit"><Shield size={17}/> PHÁT LỆNH TRIỂN KHAI</button>
    </form>}

    <div className="search-command"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm mã, tên nhiệm vụ, chiến dịch..."/></div>
    <div className="filter-tabs"><button className={status === 'all' ? 'active' : ''} onClick={() => setStatus('all')}>TẤT CẢ</button><button className={status === 'active' ? 'active' : ''} onClick={() => setStatus('active')}>ĐANG CHẠY</button><button className={status === 'completed' ? 'active' : ''} onClick={() => setStatus('completed')}>HOÀN THÀNH</button></div>

    <section className="campaign-list tactical-list compact-six-list compact-six-missions">{filtered.map((task) => { const pct = Math.round(((task.completedCount || 0)/(task.totalCount || 1))*100); return <div className="campaign-row tactical-row campaign-manage-row" key={task.id}><button className="campaign-open-area" type="button" onClick={() => onOpenMission(task)}><div className="mission-code">{task.code?.replace('NV-2026-', 'M-') || `M-${task.id}`}</div><div className="campaign-main"><div className="mission-title-line"><strong>{task.title}</strong><span className={`priority-chip ${task.priority || 'normal'}`}>{task.priority === 'urgent' ? 'KHẨN' : task.priority === 'important' ? 'QUAN TRỌNG' : 'THƯỜNG'}</span></div><span>{task.completedCount}/{task.totalCount} hoàn thành · {task.deadline}</span><div className="micro-progress"><i style={{ width: `${pct}%` }}/></div></div><div className="campaign-pct">{pct}% <ChevronRight size={13}/></div></button><button className="row-delete-btn" type="button" onClick={() => setDeleteTarget(task)}><Trash2 size={16}/></button></div>})}</section>

    <ConfirmDialog open={Boolean(deleteTarget)} title="Xóa nhiệm vụ này?" description={deleteTarget ? `${deleteTarget.code || ''} · ${deleteTarget.title} sẽ bị xóa khỏi hệ thống.` : ''} confirmLabel="XÓA NHIỆM VỤ" onCancel={() => setDeleteTarget(null)} onConfirm={() => { if (deleteTarget) onDeleteTask(deleteTarget.id); setDeleteTarget(null) }}/>
  </div>
}
