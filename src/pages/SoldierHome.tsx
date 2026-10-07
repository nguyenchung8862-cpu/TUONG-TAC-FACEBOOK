import { useMemo } from 'react'
import { CheckCircle2, ChevronRight, Flame, Target } from 'lucide-react'
import type { AppUser, MissionTask } from '../types'
import { TaskCard } from '../components/TaskCard'

export function SoldierHome({ user, onOpenTask, tasks, showAll = false, onViewAll }: { user: AppUser; onOpenTask: (task: MissionTask) => void; tasks: MissionTask[]; showAll?: boolean; onViewAll?: () => void }) {
  const pending = useMemo(() => tasks.filter((task) => task.status !== 'completed').length, [tasks])
  const visible = showAll ? tasks : tasks.slice(0, 2)
  return <div className="page-stack">
    <section className="hero-card soldier-hero"><div className="hero-badge"><Flame size={16}/> TRỰC NHIỆM VỤ</div><div className="hero-title">{user.name}</div><div className="hero-subtitle">{user.squad} · {tasks.length} nhiệm vụ được giao</div><div className="hero-metrics"><button type="button" onClick={onViewAll}><strong>{pending}</strong><span>Chưa xong</span></button><button type="button" onClick={onViewAll}><strong>{tasks.filter((t) => t.status === 'completed').length}</strong><span>Đã hoàn thành</span></button><button type="button" onClick={onViewAll}><strong>{user.completionRate ?? 0}%</strong><span>Kỷ luật thực hiện</span></button></div></section>
    <section className="section-block"><div className="section-heading"><div><span className="section-kicker">{showAll ? 'TOÀN BỘ' : 'ƯU TIÊN'}</span><h2>{showAll ? 'Danh sách nhiệm vụ' : 'Nhiệm vụ cần làm'}</h2></div>{!showAll && <button className="ghost-link" type="button" onClick={onViewAll}>Tất cả <ChevronRight size={16}/></button>}</div><div className={showAll ? "task-list compact-six-list compact-six-taskcards" : "task-list"}>{visible.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpenTask}/>)}</div></section>
    {!showAll && <button className="progress-card progress-card-button" type="button" onClick={onViewAll}><div className="progress-icon"><Target size={21}/></div><div className="progress-copy"><div className="progress-title">Mục tiêu ngày</div><div className="progress-text">Hoàn tất toàn bộ nhiệm vụ trước thời hạn</div><div className="mini-progress"><span style={{ width: `${tasks.length ? Math.round(((tasks.length - pending)/tasks.length)*100) : 0}%` }}/></div></div><CheckCircle2 size={20}/></button>}
  </div>
}
