import { Sparkles } from 'lucide-react'

export function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-panel">
      <div className="empty-icon"><Sparkles size={22} /></div>
      <div className="empty-title">{title}</div>
      <div className="empty-text">{text}</div>
    </div>
  )
}
