import { useState } from 'react'
import { ArrowLeft, BarChart3, CheckCircle2, Heart, MessageCircle, ShieldCheck, Share2, TrendingUp, UsersRound, X } from 'lucide-react'
import type { AppUser, MissionTask } from '../types'

type InsightMode = 'squads' | 'progress' | 'like' | 'comment' | 'share'

const titleByMode: Record<InsightMode, string> = { squads: 'Biên chế tiểu đội', progress: 'Tiến độ toàn đơn vị', like: 'Thống kê Like', comment: 'Thống kê bình luận', share: 'Thống kê chia sẻ' }

export function AdminInsights({ mode, users, tasks, onBack, onOpenMission }: { mode: InsightMode; users: AppUser[]; tasks: MissionTask[]; onBack: () => void; onOpenMission: (task: MissionTask) => void }) {
  const [selectedSquad, setSelectedSquad] = useState<string | null>(null)
  const squads = Array.from(new Set(users.filter((user) => user.role !== 'admin').map((user) => user.squad)))
  const icon = mode === 'squads' ? <ShieldCheck size={22} /> : mode === 'progress' ? <TrendingUp size={22} /> : mode === 'like' ? <Heart size={22} /> : mode === 'comment' ? <MessageCircle size={22} /> : <Share2 size={22} />
  const squadMembers = selectedSquad ? users.filter((user) => user.squad === selectedSquad) : []

  return (
    <div className="page-stack admin-insights-page">
      <button className="inline-back" type="button" onClick={onBack}><ArrowLeft size={17} /> Về Sở chỉ huy</button>
      <section className="ops-title-card insight-title-card"><div className="ops-title-icon">{icon}</div><div><span className="military-kicker">BÁO CÁO TÁC NGHIỆP</span><h1>{titleByMode[mode]}</h1><p>Chạm vào từng dòng để mở hồ sơ chi tiết.</p></div></section>

      {mode === 'squads' ? (
        <section className="squad-register">
          {squads.map((squad, index) => {
            const members = users.filter((user) => user.squad === squad)
            return <button className="squad-register-row" type="button" key={squad} onClick={() => setSelectedSquad(squad)}><div className="squad-number">{String(index + 1).padStart(2, '0')}</div><div><strong>{squad}</strong><span>{members.length} tài khoản · {members.filter((u) => u.role === 'leader').length} tiểu đội trưởng</span></div><UsersRound size={18} /></button>
          })}
        </section>
      ) : (
        <section className="insight-mission-list compact-six-list compact-six-insights">
          {tasks.map((task) => {
            const total = task.totalCount || 1
            const completed = task.completedCount || 0
            const progress = Math.round((completed / total) * 100)
            const value = mode === 'progress' ? progress : mode === 'like' ? Math.min(100, progress + 9) : mode === 'comment' ? Math.min(100, progress + 2) : Math.max(0, progress - 8)
            return <button className="insight-mission-row" type="button" key={task.id} onClick={() => onOpenMission(task)}><div className="insight-row-icon">{mode === 'progress' ? <BarChart3 size={17} /> : mode === 'like' ? <Heart size={17} /> : mode === 'comment' ? <MessageCircle size={17} /> : <Share2 size={17} />}</div><div className="insight-row-main"><strong>{task.title}</strong><span>{task.campaign}</span><div className="register-progress"><span style={{ width: `${value}%` }} /></div></div><div className="insight-row-value"><b>{value}%</b><CheckCircle2 size={14} /></div></button>
          })}
        </section>
      )}

      {selectedSquad && <div className="dialog-backdrop" onMouseDown={() => setSelectedSquad(null)}><section className="account-detail-sheet" onMouseDown={(event) => event.stopPropagation()}><div className="sheet-grip" /><div className="account-detail-head"><div className="account-avatar leader"><ShieldCheck size={18} /></div><div><span className="section-kicker">BIÊN CHẾ ĐƠN VỊ</span><h3>{selectedSquad}</h3><p>{squadMembers.length} tài khoản trong hệ thống demo</p></div><button className="dialog-close" type="button" onClick={() => setSelectedSquad(null)}><X size={17} /></button></div><div className="sheet-member-list compact-six-list compact-six-sheet-members">{squadMembers.map((member) => <div key={member.id}><span>{member.name}</span><b>{member.role === 'leader' ? 'TĐT' : 'CHIẾN SĨ'}</b></div>)}</div></section></div>}
    </div>
  )
}
