import { BellRing, CheckCheck, CheckCircle2, Clock3, Radio, RotateCcw } from 'lucide-react'
import type { NotificationItem } from '../types'

export function NotificationsPage({ items, onOpen, onReadAll }: { items: NotificationItem[]; onOpen: (item: NotificationItem) => void; onReadAll: () => void }) {
  const unread = items.filter((i) => i.unread).length
  return <div className="page-stack">
    <section className="ops-title-card"><div className="ops-title-icon"><BellRing size={21}/></div><div><span className="military-kicker">TRUNG TÂM THÔNG BÁO</span><h1>Thông báo tác nghiệp</h1><p>{unread} thông báo chưa đọc · chạm để mở nội dung liên quan.</p></div></section>
    <div className="notification-toolbar"><button type="button" onClick={onReadAll}><CheckCheck size={15}/> ĐÁNH DẤU ĐÃ ĐỌC</button><button type="button" onClick={() => location.reload()}><RotateCcw size={15}/> LÀM MỚI</button></div>
    <div className="notification-list">{items.map((item) => <button className={`notification-row ${item.unread ? 'unread' : ''}`} type="button" key={item.id} onClick={() => onOpen(item)}>{item.type === 'mission' ? <Radio size={17}/> : item.type === 'deadline' || item.type === 'reminder' ? <Clock3 size={17}/> : <CheckCircle2 size={17}/>}<div><strong>{item.title}</strong><span>{item.text}</span></div><small>{item.unread ? 'MỚI' : item.time}</small></button>)}</div>
  </div>
}
