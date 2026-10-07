import { AlertTriangle, Trash2, X } from 'lucide-react'
import { createPortal } from 'react-dom'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Xóa',
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open) return null

  return createPortal(
    <div className="dialog-backdrop confirm-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-head">
          <div className="dialog-alert-icon"><AlertTriangle size={19} /></div>
          <button className="dialog-close" type="button" onClick={onCancel} aria-label="Đóng"><X size={17} /></button>
        </div>
        <span className="section-kicker">XÁC NHẬN MỆNH LỆNH</span>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="dialog-actions">
          <button className="dialog-cancel" type="button" onClick={onCancel}>Hủy</button>
          <button className="dialog-danger" type="button" onClick={onConfirm}><Trash2 size={16} /> {confirmLabel}</button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
