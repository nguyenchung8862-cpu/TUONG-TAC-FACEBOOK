import type { Role } from '../types'

export function RoleSwitcher({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  return (
    <div className="role-switcher-wrap">
      <div className="role-switcher">
        <button className={role === 'soldier' ? 'active' : ''} onClick={() => onChange('soldier')}>Chiến sĩ</button>
        <button className={role === 'leader' ? 'active' : ''} onClick={() => onChange('leader')}>Tiểu đội trưởng</button>
        <button className={role === 'admin' ? 'active' : ''} onClick={() => onChange('admin')}>Admin</button>
      </div>
    </div>
  )
}
