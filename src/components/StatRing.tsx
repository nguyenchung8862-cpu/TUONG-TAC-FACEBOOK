export function StatRing({ value, label, total, onClick }: { value: number; label: string; total: string; onClick?: () => void }) {
  const deg = Math.max(0, Math.min(100, value)) * 3.6
  const content = (
    <>
      <div className="ring" style={{ background: `conic-gradient(var(--accent) ${deg}deg, rgba(148,163,184,.16) ${deg}deg)` }}>
        <div className="ring-inner"><strong>{value}%</strong><span>{total}</span></div>
      </div>
      <div className="ring-label">{label}</div>
    </>
  )

  return onClick ? <button className="stat-ring-card interactive-card" type="button" onClick={onClick}>{content}</button> : <div className="stat-ring-card">{content}</div>
}
