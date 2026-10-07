export type Role = 'soldier' | 'leader' | 'admin'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue'
export type Priority = 'normal' | 'important' | 'urgent'

export interface AppUser {
  id: number
  name: string
  username: string
  password: string
  role: Role
  squad: string
  squadId?: number
  active: boolean
  rank?: string
  phone?: string
  lastSeen?: string
  completedMissions?: number
  completionRate?: number
  avatarUrl?: string
}

export interface Squad {
  id: number
  code: string
  name: string
  leaderId?: number
  leaderName?: string
  memberCount: number
  active: boolean
  completionRate: number
}

export interface MissionTask {
  id: number
  code?: string
  title: string
  campaign: string
  deadline: string
  facebookUrl: string
  requireLike: boolean
  requireComment: boolean
  requireShare: boolean
  status: TaskStatus
  priority?: Priority
  completedCount?: number
  totalCount?: number
  createdAt?: string
  createdBy?: string
  assignedSquadIds?: number[]
  note?: string
}

export interface SoldierRow {
  id: number
  name: string
  squad: string
  like: boolean
  comment: boolean
  share: boolean
  completed: boolean
  evidence?: string
  completedAt?: string
}

export interface NotificationItem {
  id: number
  type: 'mission' | 'deadline' | 'success' | 'reminder' | 'system'
  title: string
  text: string
  time: string
  unread: boolean
  taskId?: number
}

export interface AuditLog {
  id: number
  action: string
  actor: string
  detail: string
  time: string
  level: 'info' | 'warning' | 'danger' | 'success'
}
