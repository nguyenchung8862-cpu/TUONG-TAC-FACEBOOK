import { useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowUpRight, Camera, Check, Heart, Image as ImageIcon, MessageCircle, Share2, Trash2, UploadCloud } from 'lucide-react'
import type { MissionTask } from '../types'
import { api } from '../lib/api'

export function TaskDetail({ task, onBack, onComplete }: { task: MissionTask; onBack: () => void; onComplete?: (taskId: number) => void }) {
  const [liked, setLiked] = useState(false)
  const [commented, setCommented] = useState(false)
  const [shared, setShared] = useState(false)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [evidence, setEvidence] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const chooseEvidence = (file?: File) => {
    if (!file) return
    setEvidence(file)
    setPreview(URL.createObjectURL(file))
  }

  async function submit() {
    setSaving(true)
    try {
      await api.completeTask(task.id, { liked, commented, shared, evidence })
      setDone(true); onComplete?.(task.id)
    } finally { setSaving(false) }
  }

  const valid = (!task.requireLike || liked) && (!task.requireComment || commented) && (!task.requireShare || shared)

  return <div className="detail-page">
    <div className="detail-topbar"><button className="icon-button" onClick={onBack}><ArrowLeft size={20}/></button><div><span className="section-kicker">{task.code || 'NHIỆM VỤ'}</span><strong>Chi tiết thực hiện</strong></div><div className="topbar-spacer"/></div>
    <section className="detail-hero"><div className="mission-title-line"><span className="status-pill pending">Đang thực hiện</span><span className={`priority-chip ${task.priority || 'normal'}`}>{task.priority === 'urgent' ? 'KHẨN' : task.priority === 'important' ? 'QUAN TRỌNG' : 'THƯỜNG'}</span></div><h1>{task.title}</h1><p>{task.campaign}</p><small>Hạn: {task.deadline}</small></section>

    <section className="instruction-card"><div className="instruction-number">01</div><div><strong>Mở bài viết Facebook</strong><p>Nhấn nút bên dưới để chuyển sang bài viết cần tương tác.</p></div></section>
    <a className="facebook-btn" href={task.facebookUrl} target="_blank" rel="noreferrer">Mở bài viết Facebook <ArrowUpRight size={18}/></a>

    <section className="instruction-card second"><div className="instruction-number">02</div><div><strong>Xác nhận nội dung đã làm</strong><p>Sau khi quay lại, đánh dấu các mục đã hoàn thành.</p></div></section>
    <div className="check-stack">{task.requireLike && <CheckRow icon={<Heart size={18}/>} label="Đã Like / Reaction" checked={liked} onClick={() => setLiked(!liked)}/>} {task.requireComment && <CheckRow icon={<MessageCircle size={18}/>} label="Đã bình luận" checked={commented} onClick={() => setCommented(!commented)}/>} {task.requireShare && <CheckRow icon={<Share2 size={18}/>} label="Đã chia sẻ" checked={shared} onClick={() => setShared(!shared)}/>}</div>

    <section className="evidence-card"><div className="evidence-head"><div><Camera size={17}/><span><strong>Ảnh minh chứng</strong><small>Tùy chọn · JPG/PNG</small></span></div>{evidence && <button type="button" onClick={() => { setEvidence(null); setPreview('') }}><Trash2 size={15}/></button>}</div>{preview ? <button className="evidence-preview" type="button" onClick={() => fileRef.current?.click()}><img src={preview} alt="Ảnh minh chứng"/><span><ImageIcon size={15}/> Đổi ảnh</span></button> : <button className="evidence-upload" type="button" onClick={() => fileRef.current?.click()}><UploadCloud size={21}/><strong>CHỌN ẢNH MINH CHỨNG</strong><span>Ảnh sẽ được gửi về máy chủ cùng báo cáo</span></button>}<input ref={fileRef} hidden type="file" accept="image/*" capture="environment" onChange={(e) => chooseEvidence(e.target.files?.[0])}/></section>

    {done ? <div className="success-panel"><div className="success-icon"><Check size={26}/></div><strong>Đã ghi nhận hoàn thành</strong><span>Kết quả và minh chứng đã được đưa vào hàng chờ đồng bộ.</span></div> : <button className="primary-btn sticky-submit" disabled={!valid || saving} onClick={submit}>{saving ? <><span className="button-spinner"/> ĐANG GỬI BÁO CÁO...</> : 'XÁC NHẬN HOÀN THÀNH'}</button>}
  </div>
}

function CheckRow({ icon, label, checked, onClick }: { icon: ReactNode; label: string; checked: boolean; onClick: () => void }) {
  return <button className={`check-row ${checked ? 'checked' : ''}`} onClick={onClick}><span className="check-row-icon">{icon}</span><span>{label}</span><span className="check-box">{checked && <Check size={15}/>}</span></button>
}
