import type { AppUser, AuditLog, MissionTask, NotificationItem, SoldierRow, Squad } from '../types'

export const initialUsers: AppUser[] = [
  { id: 1, name: 'Quản trị hệ thống', username: 'admin', password: '123456', role: 'admin', squad: 'Bộ chỉ huy', active: true, rank: 'Quản trị', lastSeen: 'Vừa xong', completedMissions: 0, completionRate: 100 },
  { id: 2, name: 'Nguyễn Văn T', username: 'tieudoitruong', password: '123456', role: 'leader', squad: 'Tiểu đội 01', squadId: 1, active: true, rank: 'Tiểu đội trưởng', lastSeen: '3 phút trước', completedMissions: 18, completionRate: 94 },
  { id: 3, name: 'Nguyễn Văn A', username: 'chiensi', password: '123456', role: 'soldier', squad: 'Tiểu đội 01', squadId: 1, active: true, rank: 'Chiến sĩ', lastSeen: '1 phút trước', completedMissions: 16, completionRate: 91 },
  { id: 4, name: 'Trần Minh B', username: 'tranminhb', password: '123456', role: 'soldier', squad: 'Tiểu đội 01', squadId: 1, active: true, rank: 'Chiến sĩ', lastSeen: '12 phút trước', completedMissions: 15, completionRate: 86 },
  { id: 5, name: 'Lê Quốc C', username: 'lequocc', password: '123456', role: 'soldier', squad: 'Tiểu đội 01', squadId: 1, active: true, rank: 'Chiến sĩ', lastSeen: '35 phút trước', completedMissions: 11, completionRate: 72 },
  { id: 6, name: 'Phạm Duy D', username: 'phamduyd', password: '123456', role: 'leader', squad: 'Tiểu đội 02', squadId: 2, active: true, rank: 'Tiểu đội trưởng', lastSeen: '8 phút trước', completedMissions: 17, completionRate: 90 },
]

export const initialSquads: Squad[] = [
  { id: 1, code: 'TĐ-01', name: 'Tiểu đội 01', leaderId: 2, leaderName: 'Nguyễn Văn T', memberCount: 12, active: true, completionRate: 92 },
  { id: 2, code: 'TĐ-02', name: 'Tiểu đội 02', leaderId: 6, leaderName: 'Phạm Duy D', memberCount: 11, active: true, completionRate: 84 },
  { id: 3, code: 'TĐ-03', name: 'Tiểu đội 03', memberCount: 12, active: true, completionRate: 76 },
  { id: 4, code: 'TĐ-04', name: 'Tiểu đội 04', memberCount: 10, active: true, completionRate: 88 },
]

export const missionTasks: MissionTask[] = [
  {
    id: 1, code: 'NV-2026-001', title: 'Tương tác bài viết tuyên truyền 07/10', campaign: 'Chiến dịch truyền thông tháng 10', deadline: '17:00 · 07/10/2026', facebookUrl: 'https://www.facebook.com/', requireLike: true, requireComment: true, requireShare: true, status: 'in_progress', priority: 'urgent', completedCount: 245, totalCount: 300, createdAt: '08:05 · 07/10/2026', createdBy: 'Quản trị hệ thống', assignedSquadIds: [1,2,3,4], note: 'Hoàn thành đúng thời hạn và gửi minh chứng khi được yêu cầu.'
  },
  {
    id: 2, code: 'NV-2026-002', title: 'Lan tỏa video hoạt động đơn vị', campaign: 'Nhiệm vụ tuần 41', deadline: '20:30 · 07/10/2026', facebookUrl: 'https://www.facebook.com/', requireLike: true, requireComment: true, requireShare: false, status: 'in_progress', priority: 'important', completedCount: 118, totalCount: 160, createdAt: '09:30 · 07/10/2026', createdBy: 'Quản trị hệ thống', assignedSquadIds: [1,2]
  },
  {
    id: 3, code: 'NV-2026-003', title: 'Tương tác bài thông báo nội bộ', campaign: 'Nhiệm vụ tuần 41', deadline: 'Đã hoàn thành', facebookUrl: 'https://www.facebook.com/', requireLike: true, requireComment: false, requireShare: false, status: 'completed', priority: 'normal', completedCount: 160, totalCount: 160, createdAt: '06/10/2026', createdBy: 'Quản trị hệ thống', assignedSquadIds: [1,2]
  },
]

export const soldiers: SoldierRow[] = [
  { id: 3, name: 'Nguyễn Văn A', squad: 'Tiểu đội 01', like: true, comment: true, share: true, completed: true, evidence: 'minh-chung-001.jpg', completedAt: '14:08' },
  { id: 4, name: 'Trần Minh B', squad: 'Tiểu đội 01', like: true, comment: true, share: false, completed: false },
  { id: 5, name: 'Lê Quốc C', squad: 'Tiểu đội 01', like: false, comment: false, share: false, completed: false },
  { id: 7, name: 'Phạm Duy D', squad: 'Tiểu đội 01', like: true, comment: true, share: true, completed: true, completedAt: '13:52' },
  { id: 8, name: 'Hoàng Anh E', squad: 'Tiểu đội 01', like: true, comment: true, share: true, completed: true, completedAt: '13:41' },
]

export const initialNotifications: NotificationItem[] = [
  { id: 1, type: 'mission', title: 'Nhiệm vụ mới được phát lệnh', text: 'Chiến dịch truyền thông tháng 10', time: '2 phút', unread: true, taskId: 1 },
  { id: 2, type: 'deadline', title: 'Nhắc thời hạn nhiệm vụ', text: 'Còn 45 phút trước thời hạn', time: '45 phút', unread: true, taskId: 1 },
  { id: 3, type: 'success', title: 'Đã ghi nhận báo cáo', text: 'Kết quả tương tác đã được cập nhật', time: 'Hôm nay', unread: false, taskId: 3 },
]

export const initialAuditLogs: AuditLog[] = [
  { id: 1, action: 'PHÁT LỆNH', actor: 'Quản trị hệ thống', detail: 'Tạo NV-2026-001 và giao cho 4 tiểu đội.', time: '08:05 · 07/10/2026', level: 'success' },
  { id: 2, action: 'TÀI KHOẢN', actor: 'Quản trị hệ thống', detail: 'Tạo tài khoản @chiensi.', time: '08:12 · 07/10/2026', level: 'info' },
  { id: 3, action: 'NHẮC VIỆC', actor: 'Nguyễn Văn T', detail: 'Nhắc 3 chiến sĩ chưa hoàn thành NV-2026-001.', time: '14:20 · 07/10/2026', level: 'warning' },
]
