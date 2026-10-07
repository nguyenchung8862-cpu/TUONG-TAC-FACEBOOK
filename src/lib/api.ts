import { missionTasks, soldiers } from '../data/mock'
import type { AppUser, AuditLog, MissionTask, NotificationItem, Squad } from '../types'

const API_URL = import.meta.env.VITE_API_URL || ''
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!API_URL) throw new Error('VITE_API_URL chưa được cấu hình')
  const token = localStorage.getItem('access_token')
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options?.headers || {}) } })
  if (!response.ok) { const payload = await response.json().catch(() => null); throw new Error(payload?.error || `API error ${response.status}`) }
  return response.json() as Promise<T>
}

export const api = {
  isMock: USE_MOCK,
  resolveAsset(path?: string) {
    if (!path) return ''
    if (/^(data:|blob:|https?:\/\/)/i.test(path)) return path
    if (!API_URL) return path
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`
  },
  async login(username: string, password: string) {
    if (USE_MOCK) return null
    const result = await request<{token:string; user:AppUser}>('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password}) })
    localStorage.setItem('access_token', result.token); return result.user
  },
  async bootstrap() {
    if (USE_MOCK) return null
    return request<{users:AppUser[]; squads:Squad[]; tasks:MissionTask[]; notifications:NotificationItem[]; auditLogs:AuditLog[]}>('/api/bootstrap')
  },
  async getTasks() { if (USE_MOCK) return structuredClone(missionTasks); return request<MissionTask[]>('/api/tasks') },
  async getSoldiers() { if (USE_MOCK) return structuredClone(soldiers); return request('/api/leader/soldiers') },
  async createTask(task: MissionTask) { if (USE_MOCK) return; return request('/api/tasks', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(task)}) },
  async deleteTask(id:number) { if (USE_MOCK) return; return request(`/api/tasks/${id}`, {method:'DELETE'}) },
  async createUser(user: Omit<AppUser,'id'|'active'>) { if (USE_MOCK) return; return request('/api/users', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(user)}) },
  async deleteUser(id:number) { if (USE_MOCK) return; return request(`/api/users/${id}`, {method:'DELETE'}) },
  async toggleUser(id:number, active:boolean) { if (USE_MOCK) return; return request(`/api/users/${id}/active`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({active})}) },
  async updateAvatar(file: File) {
    if (USE_MOCK) return ''
    const form = new FormData(); form.set('avatar', file)
    const result = await request<{avatarUrl:string}>('/api/profile/avatar', { method:'POST', body:form })
    return result.avatarUrl
  },
  async createSquad(squad: Squad) { if (USE_MOCK) return; return request('/api/squads', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(squad)}) },
  async updateSquad(squad: Squad) { if (USE_MOCK) return; return request(`/api/squads/${squad.id}`, {method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(squad)}) },
  async deleteSquad(id:number) { if (USE_MOCK) return; return request(`/api/squads/${id}`, {method:'DELETE'}) },
  async completeTask(taskId: number, payload: { liked: boolean; commented: boolean; shared: boolean; evidence?: File | null }) {
    if (USE_MOCK) { await new Promise((resolve) => setTimeout(resolve, 650)); return { ok: true, taskId, ...payload, evidence: payload.evidence?.name } }
    const form = new FormData(); form.set('liked', String(payload.liked)); form.set('commented', String(payload.commented)); form.set('shared', String(payload.shared)); if (payload.evidence) form.set('evidence', payload.evidence)
    return request(`/api/tasks/${taskId}/complete`, { method: 'POST', body: form })
  },
  logout() { localStorage.removeItem('access_token') },
}
