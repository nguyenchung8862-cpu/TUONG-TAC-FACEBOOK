import { ArrowUpRight, CheckCircle2, Clock3, Heart, MessageCircle, Share2 } from 'lucide-react'
import type { MissionTask } from '../types'

export function TaskCard({ task, onOpen }: { task: MissionTask; onOpen: (task: MissionTask) => void }) {
  const statusLabel = task.status === 'completed' ? 'Hoàn thành' : task.status === 'in_progress' ? 'Đang thực hiện' : 'Mới'
  return (
    <button className="task-card task-card-button" type="button" onClick={() => onOpen(task)}>
      <div className="task-card-top"><span className={`status-pill ${task.status}`}>{statusLabel}</span><span className="deadline"><Clock3 size={14} /> {task.deadline}</span></div>
      <div className="task-title">{task.title}</div><div className="task-campaign">{task.campaign}</div>
      <div className="requirements">{task.requireLike && <span><Heart size={16} /> Like</span>}{task.requireComment && <span><MessageCircle size={16} /> Bình luận</span>}{task.requireShare && <span><Share2 size={16} /> Chia sẻ</span>}</div>
      <div className="task-actions">{task.status === 'completed' ? <div className="done-row"><CheckCircle2 size={18} /> Xem kết quả</div> : <div className="primary-btn task-open-faux">Thực hiện nhiệm vụ <ArrowUpRight size={18} /></div>}</div>
    </button>
  )
}
