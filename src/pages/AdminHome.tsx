import { BarChart3, ChevronRight, Plus, Shield, ShieldCheck, Star, TrendingUp, UsersRound } from 'lucide-react'
import { StatRing } from '../components/StatRing'
import type { AppUser, MissionTask, Squad } from '../types'

export type AdminInsightKey = 'squads' | 'progress' | 'like' | 'comment' | 'share'

type Props = {
  tasks: MissionTask[]
  users: AppUser[]
  squads: Squad[]
  onAddCampaign: () => void
  onViewCampaigns: () => void
  onViewUsers: () => void
  onViewSquads: () => void
  onOpenInsight: (key: AdminInsightKey) => void
  onOpenMission: (task: MissionTask) => void
}

export function AdminHome({ tasks, users, squads, onAddCampaign, onViewCampaigns, onViewUsers, onViewSquads, onOpenInsight, onOpenMission }: Props) {
  const total = tasks.reduce((sum, task) => sum + (task.totalCount || 0), 0)
  const completed = tasks.reduce((sum, task) => sum + (task.completedCount || 0), 0)
  const overall = total ? Math.round((completed / total) * 100) : 0
  const force = users.filter((u) => u.role !== 'admin' && u.active).length
  const latest = tasks.slice(0, 4)
  const likePct = Math.min(100, overall + 8)
  const commentPct = Math.min(100, overall + 2)
  const sharePct = Math.max(0, overall - 7)

  return <div className="page-stack admin-command-page">
    <section className="command-board"><div className="command-board-grid" aria-hidden="true"/><div className="command-board-topline"><span className="command-hq-label"><span>SỞ CHỈ HUY LỰC LƯỢNG 47 // HQ-01</span></span><span className="command-live"><i/> TRỰC CHIẾN</span></div><div className="command-board-main"><div className="command-insignia" aria-hidden="true"><Star size={24} fill="currentColor"/><span>HQ</span></div><div className="command-copy"><span className="military-kicker">BẢNG ĐIỀU HÀNH TÁC NGHIỆP</span><h1>Chiến dịch đang chạy</h1><p><b>{completed}/{total || 0}</b> lượt thực hiện đã được ghi nhận trên toàn đơn vị.</p></div></div><div className="command-board-footer"><button type="button" className="command-footer-action" onClick={() => onOpenInsight('progress')}><span>TÌNH TRẠNG</span><strong>ỔN ĐỊNH</strong></button><button type="button" className="command-footer-action" onClick={() => onOpenInsight('progress')}><span>HOÀN THÀNH</span><strong>{overall}%</strong></button><button className="command-add" type="button" onClick={onAddCampaign}><Plus size={20} strokeWidth={2.6}/><span>PHÁT LỆNH MỚI</span></button></div></section>

    <section className="intel-strip"><span>OPERATIONS STATUS</span><i/><span>DỮ LIỆU CẬP NHẬT LIÊN TỤC</span></section>
    <section className="rings-grid tactical-rings"><StatRing value={likePct} label="Like" total={`${Math.round(total*likePct/100)}/${total || 0}`} onClick={() => onOpenInsight('like')}/><StatRing value={commentPct} label="Bình luận" total={`${Math.round(total*commentPct/100)}/${total || 0}`} onClick={() => onOpenInsight('comment')}/><StatRing value={sharePct} label="Chia sẻ" total={`${Math.round(total*sharePct/100)}/${total || 0}`} onClick={() => onOpenInsight('share')}/></section>
    <section className="admin-summary-grid tactical-summary"><button className="summary-tile interactive-card" type="button" onClick={onViewUsers}><UsersRound size={20}/><div><strong>{force}</strong><span>QUÂN SỐ</span></div><ChevronRight size={15} className="tile-chevron"/></button><button className="summary-tile interactive-card" type="button" onClick={onViewSquads}><ShieldCheck size={20}/><div><strong>{squads.length}</strong><span>TIỂU ĐỘI</span></div><ChevronRight size={15} className="tile-chevron"/></button><button className="summary-tile interactive-card" type="button" onClick={() => onOpenInsight('progress')}><TrendingUp size={20}/><div><strong>{overall}%</strong><span>TIẾN ĐỘ</span></div><ChevronRight size={15} className="tile-chevron"/></button><button className="summary-tile interactive-card" type="button" onClick={onViewCampaigns}><BarChart3 size={20}/><div><strong>{String(tasks.length).padStart(2,'0')}</strong><span>NHIỆM VỤ</span></div><ChevronRight size={15} className="tile-chevron"/></button></section>

    <section className="section-block"><div className="section-heading military-heading"><div><span className="section-kicker">DANH SÁCH LỆNH</span><h2>Chiến dịch đang triển khai</h2></div><button className="ghost-link" type="button" onClick={onViewCampaigns}>Tất cả <ChevronRight size={16}/></button></div><div className="campaign-list tactical-list">{latest.map((task) => { const pct = Math.round(((task.completedCount || 0)/(task.totalCount || 1))*100); return <button className="campaign-row tactical-row" type="button" key={task.id} onClick={() => onOpenMission(task)}><div className="mission-code">{task.code?.slice(-3) || task.id}</div><div className="campaign-main"><div className="mission-title-line"><strong>{task.title}</strong><span className={`priority-chip ${task.priority || 'normal'}`}>{task.priority === 'urgent' ? 'KHẨN' : task.priority === 'important' ? 'Q.TRỌNG' : 'THƯỜNG'}</span></div><span>{task.completedCount}/{task.totalCount} hoàn thành · {task.deadline}</span><div className="micro-progress"><i style={{ width: `${pct}%` }}/></div></div><div className="campaign-pct">{pct}% <ChevronRight size={13}/></div></button>})}</div></section>
  </div>
}
