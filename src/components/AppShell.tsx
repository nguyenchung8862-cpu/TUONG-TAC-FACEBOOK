import type { ReactNode } from 'react'
import { Bell, House, ListChecks, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import type { Role } from '../types'

type Props = {
  role: Role
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
  onNotifications: () => void
  title?: string
  unreadCount?: number
  online?: boolean
}

const navByRole: Record<Role, { key: string; label: string; icon: typeof House }[]> = {
  soldier: [
    { key: 'home', label: 'Trang chủ', icon: House },
    { key: 'tasks', label: 'Nhiệm vụ', icon: ListChecks },
    { key: 'alerts', label: 'Thông báo', icon: Bell },
    { key: 'profile', label: 'Cá nhân', icon: UserRound },
  ],
  leader: [
    { key: 'home', label: 'Tổng quan', icon: House },
    { key: 'tasks', label: 'Nhiệm vụ', icon: ListChecks },
    { key: 'squad', label: 'Tiểu đội', icon: ShieldCheck },
    { key: 'profile', label: 'Cá nhân', icon: UserRound },
  ],
  admin: [
    { key: 'home', label: 'Chỉ huy', icon: House },
    { key: 'tasks', label: 'Nhiệm vụ', icon: ListChecks },
    { key: 'squads', label: 'Tiểu đội', icon: ShieldCheck },
    { key: 'users', label: 'Quân số', icon: UsersRound },
    { key: 'profile', label: 'Hệ thống', icon: UserRound },
  ],
}

export function AppShell({ role, children, activeTab, onTabChange, onNotifications, title, unreadCount = 0, online = true }: Props) {
  const nav = navByRole[role]
  return <div className="app-frame">
    <div className="top-safe"/>
    {!online && <div className="offline-banner">MẤT KẾT NỐI · Dữ liệu sẽ được đồng bộ khi có mạng</div>}
    <header className="app-header">
      <button className="header-brand-button" type="button" onClick={() => onTabChange('home')}>
        <img className="app-header-logo" src={`${import.meta.env.BASE_URL}logo-bchqs-bu-gia-map.png`} alt="Logo Ban Chỉ huy Quân sự xã Bù Gia Mập" />
        <span className="header-brand-copy">
          <span className="header-command-line">SỞ CHỈ HUY LỰC LƯỢNG 47</span>
          <span className="eyebrow">BAN CHỈ HUY QUÂN SỰ XÃ BÙ GIA MẬP</span>
        </span>
      </button>
      <button className="icon-button" type="button" aria-label="Thông báo" onClick={onNotifications}><Bell size={20} strokeWidth={2.1}/>{unreadCount > 0 && <span className="notification-count">{unreadCount > 9 ? '9+' : unreadCount}</span>}</button>
    </header>
    <main className="app-scroll">{children}</main>
    <nav className={`bottom-nav ${role === 'admin' ? 'five-items' : ''}`}>{nav.map((item) => { const Icon = item.icon; const active = activeTab === item.key; return <button className={`nav-item ${active ? 'active' : ''}`} type="button" key={item.key} onClick={() => onTabChange(item.key)}><span className="nav-icon"><Icon size={19} strokeWidth={2.2}/></span><span>{item.label}</span></button> })}</nav>
  </div>
}
