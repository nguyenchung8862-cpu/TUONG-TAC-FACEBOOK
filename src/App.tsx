import { useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import { SoldierHome } from './pages/SoldierHome'
import { LeaderHome } from './pages/LeaderHome'
import { AdminHome, type AdminInsightKey } from './pages/AdminHome'
import { AdminUsers } from './pages/AdminUsers'
import { AdminCampaigns } from './pages/AdminCampaigns'
import { AdminMissionDetail } from './pages/AdminMissionDetail'
import { AdminInsights } from './pages/AdminInsights'
import { AdminSquads } from './pages/AdminSquads'
import { AdminSettings } from './pages/AdminSettings'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { TaskDetail } from './pages/TaskDetail'
import { Login } from './pages/Login'
import { ConfirmDialog } from './components/ConfirmDialog'
import { PwaInstallDialog } from './components/PwaInstallDialog'
import { initialAuditLogs, initialNotifications, initialSquads, initialUsers, missionTasks } from './data/mock'
import { usePersistentState } from './hooks/usePersistentState'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { usePwaInstall } from './hooks/usePwaInstall'
import { api } from './lib/api'
import type { AppUser, AuditLog, MissionTask, NotificationItem, Role, Squad } from './types'

const nowLabel = () => new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })

export default function App() {
  const [users, setUsers] = usePersistentState<AppUser[]>('mission:v4:users', initialUsers)
  const [tasks, setTasks] = usePersistentState<MissionTask[]>('mission:v4:tasks', missionTasks)
  const [squads, setSquads] = usePersistentState<Squad[]>('mission:v4:squads', initialSquads)
  const [notifications, setNotifications] = usePersistentState<NotificationItem[]>('mission:v4:notifications', initialNotifications)
  const [auditLogs, setAuditLogs] = usePersistentState<AuditLog[]>('mission:v4:audit', initialAuditLogs)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [selectedTask, setSelectedTask] = useState<MissionTask | null>(null)
  const [selectedAdminTask, setSelectedAdminTask] = useState<MissionTask | null>(null)
  const [deleteTaskTarget, setDeleteTaskTarget] = useState<MissionTask | null>(null)
  const [adminInsight, setAdminInsight] = useState<AdminInsightKey | null>(null)
  const [campaignFormOpen, setCampaignFormOpen] = useState(false)
  const online = useOnlineStatus()
  const pwa = usePwaInstall()
  const role: Role = currentUser?.role ?? 'soldier'
  const unreadCount = notifications.filter((n) => n.unread).length

  const addAudit = (action: string, detail: string, level: AuditLog['level'] = 'info', actor = currentUser?.name || 'Hệ thống') => setAuditLogs((prev) => [{ id: Date.now(), action, actor, detail, time: nowLabel(), level }, ...prev].slice(0, 100))
  const addNotification = (item: Omit<NotificationItem, 'id' | 'time'>) => setNotifications((prev) => [{ ...item, id: Date.now(), time: 'Vừa xong' }, ...prev].slice(0, 50))

  const login = async (username: string, password: string) => {
    if (!api.isMock) {
      try {
        const remoteUser = await api.login(username, password)
        if (!remoteUser) return false
        setCurrentUser(remoteUser); setActiveTab('home')
        const boot = await api.bootstrap()
        if (boot) { if (boot.users.length) setUsers(boot.users); setTasks(boot.tasks); setSquads(boot.squads); setNotifications(boot.notifications); setAuditLogs(boot.auditLogs) }
        return true
      } catch { return false }
    }
    const found = users.find((u) => u.active && u.username.toLowerCase() === username.toLowerCase() && u.password === password)
    if (!found) return false
    setCurrentUser(found); setActiveTab('home'); addAudit('ĐĂNG NHẬP', `@${found.username} đăng nhập hệ thống.`, 'success', found.name); return true
  }

  const createUser = (input: Omit<AppUser, 'id' | 'active'>) => {
    if (users.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) return false
    const user: AppUser = { ...input, id: Date.now(), active: true }
    setUsers((prev) => [...prev, user]); void api.createUser(input).catch(() => undefined); addAudit('TẠO TÀI KHOẢN', `Tạo @${user.username} · ${user.squad}.`, 'success'); return true
  }
  const bulkCreateUsers = (inputs: Omit<AppUser, 'id' | 'active'>[]) => {
    let added = 0
    setUsers((prev) => { const next = [...prev]; for (const input of inputs) { if (!next.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) { next.push({ ...input, id: Date.now() + added, active: true }); added++ } } return next })
    if (added) {
      addAudit('NHẬP QUÂN SỐ', `Nhập ${added} tài khoản từ Excel/CSV.`, 'success')
      if (!api.isMock) inputs.forEach((input) => { void api.createUser(input).catch(() => undefined) })
    }
    return added
  }
  const deleteUser = (id: number) => { if (currentUser?.id === id) return; const target = users.find((u) => u.id === id); setUsers((prev) => prev.filter((u) => u.id !== id)); void api.deleteUser(id).catch(() => undefined); if (target) addAudit('XÓA TÀI KHOẢN', `Đã xóa @${target.username}.`, 'danger') }
  const toggleUserActive = (id: number) => { const target = users.find((u) => u.id === id); setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: !u.active } : u)); if (target) void api.toggleUser(id, !target.active).catch(() => undefined); if (target) addAudit(target.active ? 'KHÓA TÀI KHOẢN' : 'MỞ KHÓA', `@${target.username}`, 'warning') }

  const createCampaign = (task: MissionTask) => { setTasks((prev) => [task, ...prev]); void api.createTask(task).catch(() => undefined); setCampaignFormOpen(false); addAudit('PHÁT LỆNH', `Tạo ${task.code} · ${task.title}.`, 'success'); addNotification({ type: 'mission', title: 'Nhiệm vụ mới được phát lệnh', text: task.title, unread: true, taskId: task.id }) }
  const deleteTask = (id: number) => { const target = tasks.find((t) => t.id === id); setTasks((prev) => prev.filter((t) => t.id !== id)); void api.deleteTask(id).catch(() => undefined); if (selectedAdminTask?.id === id) setSelectedAdminTask(null); setDeleteTaskTarget(null); if (target) addAudit('XÓA NHIỆM VỤ', `${target.code} · ${target.title}.`, 'danger') }
  const completeTask = (id: number) => { setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completedCount: Math.min((t.totalCount || 1), (t.completedCount || 0) + 1), status: (t.completedCount || 0) + 1 >= (t.totalCount || 1) ? 'completed' : 'in_progress' } : t)); addAudit('HOÀN THÀNH', `Đã ghi nhận báo cáo cho nhiệm vụ #${id}.`, 'success'); addNotification({ type: 'success', title: 'Đã ghi nhận báo cáo', text: 'Kết quả nhiệm vụ đã được cập nhật.', unread: true, taskId: id }) }

  const createSquad = (squad: Squad) => { setSquads((prev) => [...prev, squad]); void api.createSquad(squad).catch(() => undefined); addAudit('THÀNH LẬP ĐƠN VỊ', `Tạo ${squad.code} · ${squad.name}.`, 'success') }
  const updateSquad = (squad: Squad) => { setSquads((prev) => prev.map((s) => s.id === squad.id ? squad : s)); void api.updateSquad(squad).catch(() => undefined); addAudit('CẬP NHẬT ĐƠN VỊ', `${squad.code} · ${squad.name}.`, 'info') }
  const deleteSquad = (id: number) => { const target = squads.find((s) => s.id === id); setSquads((prev) => prev.filter((s) => s.id !== id)); void api.deleteSquad(id).catch(() => undefined); if (target) addAudit('XÓA ĐƠN VỊ', `${target.code} · ${target.name}.`, 'danger') }

  const remindSquad = () => { addNotification({ type: 'reminder', title: 'Tiểu đội trưởng đã nhắc việc', text: 'Các chiến sĩ chưa đạt tiến độ cần hoàn thành nhiệm vụ.', unread: true }); addAudit('NHẮC VIỆC', 'Gửi nhắc việc cho quân số chưa đạt tiến độ.', 'warning') }
  const markNotificationOpen = (item: NotificationItem) => { setNotifications((prev) => prev.map((n) => n.id === item.id ? { ...n, unread: false } : n)); const task = tasks.find((t) => t.id === item.taskId); if (task) { if (role === 'admin') { setSelectedAdminTask(task); setAdminInsight(null) } else setSelectedTask(task) } }
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))

  const resetDemo = () => { setUsers(initialUsers); setTasks(missionTasks); setSquads(initialSquads); setNotifications(initialNotifications); setAuditLogs(initialAuditLogs); addAudit('KHÔI PHỤC DEMO', 'Đưa dữ liệu mẫu về trạng thái ban đầu.', 'warning') }

  const goToCampaigns = (openForm = false) => { setActiveTab('tasks'); setCampaignFormOpen(openForm); setAdminInsight(null); setSelectedAdminTask(null) }
  const changeTab = (tab: string) => { setActiveTab(tab); setAdminInsight(null); setSelectedAdminTask(null); if (tab !== 'tasks') setCampaignFormOpen(false) }
  const openAdminInsight = (key: AdminInsightKey) => { setAdminInsight(key); setSelectedAdminTask(null) }
  const openAdminMission = (task: MissionTask) => { setSelectedAdminTask(task); setAdminInsight(null) }
  const logout = () => { if (currentUser) addAudit('ĐĂNG XUẤT', `@${currentUser.username} rời hệ thống.`, 'info', currentUser.name); api.logout(); setCurrentUser(null); setActiveTab('home'); setSelectedTask(null); setSelectedAdminTask(null); setAdminInsight(null); setCampaignFormOpen(false) }

  const updateAvatar = async (file: File, previewDataUrl: string) => {
    if (!currentUser) return false
    try {
      const avatarUrl = api.isMock ? previewDataUrl : await api.updateAvatar(file)
      if (!avatarUrl) return false
      const updated = { ...currentUser, avatarUrl }
      setCurrentUser(updated)
      setUsers((prev) => prev.map((user) => user.id === updated.id ? { ...user, avatarUrl } : user))
      addAudit('CẬP NHẬT ẢNH ĐẠI DIỆN', `@${updated.username} đã cập nhật ảnh đại diện.`, 'success', updated.name)
      return true
    } catch {
      return false
    }
  }

  const squadTasks = useMemo(() => role === 'leader' && currentUser?.squadId ? tasks.filter((t) => !t.assignedSquadIds?.length || t.assignedSquadIds.includes(currentUser.squadId!)) : tasks, [tasks, role, currentUser])

  if (!currentUser) return <div className="desktop-canvas"><Login onLogin={login}/></div>
  if (selectedTask) return <div className="desktop-canvas"><div className="app-frame"><TaskDetail task={selectedTask} onBack={() => setSelectedTask(null)} onComplete={completeTask}/></div></div>

  let content
  if (role === 'admin' && selectedAdminTask) content = <AdminMissionDetail task={selectedAdminTask} squads={squads} users={users} onBack={() => setSelectedAdminTask(null)} onDelete={() => setDeleteTaskTarget(selectedAdminTask)}/>
  else if (role === 'admin' && adminInsight) content = <AdminInsights mode={adminInsight} users={users} tasks={tasks} onBack={() => setAdminInsight(null)} onOpenMission={openAdminMission}/>
  else if (activeTab === 'alerts') content = <NotificationsPage items={notifications} onOpen={markNotificationOpen} onReadAll={markAllRead}/>
  else if (role === 'admin' && activeTab === 'profile') content = <AdminSettings user={currentUser} users={users} tasks={tasks} squads={squads} logs={auditLogs} online={online} onLogout={logout} onResetDemo={resetDemo} onInstallApp={pwa.requestInstall} pwaInstalled={pwa.installed}/>
  else if (activeTab === 'profile') content = <ProfilePage user={currentUser} onLogout={logout} onUpdateAvatar={updateAvatar} onInstallApp={pwa.requestInstall} pwaInstalled={pwa.installed}/>
  else if (role === 'soldier' && activeTab === 'home') content = <SoldierHome user={currentUser} onOpenTask={setSelectedTask} tasks={tasks} onViewAll={() => changeTab('tasks')}/>
  else if (role === 'soldier' && activeTab === 'tasks') content = <SoldierHome user={currentUser} onOpenTask={setSelectedTask} tasks={tasks} showAll onViewAll={() => changeTab('tasks')}/>
  else if (role === 'leader' && activeTab === 'home') content = <LeaderHome user={currentUser} users={users} tasks={squadTasks} focus="overview" onOpenTask={setSelectedTask} onRemind={remindSquad}/>
  else if (role === 'leader' && activeTab === 'tasks') content = <LeaderHome user={currentUser} users={users} tasks={squadTasks} focus="tasks" onOpenTask={setSelectedTask} onRemind={remindSquad}/>
  else if (role === 'leader' && activeTab === 'squad') content = <LeaderHome user={currentUser} users={users} tasks={squadTasks} focus="squad" onOpenTask={setSelectedTask} onRemind={remindSquad}/>
  else if (role === 'admin' && activeTab === 'home') content = <AdminHome tasks={tasks} users={users} squads={squads} onAddCampaign={() => goToCampaigns(true)} onViewCampaigns={() => goToCampaigns(false)} onViewUsers={() => changeTab('users')} onViewSquads={() => changeTab('squads')} onOpenInsight={openAdminInsight} onOpenMission={openAdminMission}/>
  else if (role === 'admin' && activeTab === 'tasks') content = <AdminCampaigns tasks={tasks} squads={squads} showCreate={campaignFormOpen} onRequestCreate={() => setCampaignFormOpen(true)} onCancelCreate={() => setCampaignFormOpen(false)} onCreate={createCampaign} onOpenMission={openAdminMission} onDeleteTask={deleteTask}/>
  else if (role === 'admin' && activeTab === 'squads') content = <AdminSquads squads={squads} users={users} onCreate={createSquad} onUpdate={updateSquad} onDelete={deleteSquad}/>
  else if (role === 'admin' && activeTab === 'users') content = <AdminUsers users={users} squads={squads} currentUserId={currentUser.id} onCreateUser={createUser} onBulkCreate={bulkCreateUsers} onDeleteUser={deleteUser} onToggleActive={toggleUserActive}/>
  else content = <NotificationsPage items={notifications} onOpen={markNotificationOpen} onReadAll={markAllRead}/>

  const title = selectedAdminTask ? 'Hồ sơ nhiệm vụ' : adminInsight ? 'Báo cáo tác nghiệp' : activeTab === 'alerts' ? 'Thông báo' : role === 'admin' && activeTab === 'profile' ? 'Hệ thống' : activeTab === 'profile' ? 'Hồ sơ cá nhân' : role === 'soldier' ? (activeTab === 'tasks' ? 'Danh sách nhiệm vụ' : 'Nhiệm vụ hôm nay') : role === 'leader' ? (activeTab === 'squad' ? 'Quân số tiểu đội' : activeTab === 'tasks' ? 'Lệnh tác nghiệp' : currentUser.squad) : activeTab === 'users' ? 'Quản lý quân số' : activeTab === 'squads' ? 'Quản lý tiểu đội' : activeTab === 'tasks' ? 'Trung tâm chiến dịch' : 'Sở chỉ huy'

  return <div className="desktop-canvas"><AppShell role={role} activeTab={activeTab} onTabChange={changeTab} onNotifications={() => changeTab('alerts')} title={title} unreadCount={unreadCount} online={online}>{content}</AppShell><ConfirmDialog open={Boolean(deleteTaskTarget)} title="Xóa nhiệm vụ này?" description={deleteTaskTarget ? `Nhiệm vụ “${deleteTaskTarget.title}” sẽ bị xóa khỏi hệ thống.` : ''} confirmLabel="XÓA NHIỆM VỤ" onCancel={() => setDeleteTaskTarget(null)} onConfirm={() => { if (deleteTaskTarget) deleteTask(deleteTaskTarget.id) }}/><PwaInstallDialog mode={pwa.helpMode} onClose={pwa.closeHelp}/></div>
}
