import { useEffect, useRef, useState } from 'react'
import { Camera, CheckCircle2, Download, ImagePlus, KeyRound, Loader2, LogOut, ShieldCheck, Smartphone, UserRound } from 'lucide-react'
import type { AppUser } from '../types'
import { api } from '../lib/api'

type Props = {
  user: AppUser
  onLogout: () => void
  onUpdateAvatar?: (file: File, previewDataUrl: string) => Promise<boolean>
  onInstallApp?: () => Promise<unknown>
  pwaInstalled?: boolean
}

function readImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Không đọc được ảnh.'))
    reader.onload = () => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Ảnh không hợp lệ.'))
      image.src = String(reader.result || '')
    }
    reader.readAsDataURL(file)
  })
}

async function makeAvatarPreview(file: File) {
  const image = await readImage(file)
  const size = 420
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Không thể xử lý ảnh trên thiết bị này.')

  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight)
  const sx = Math.max(0, (image.naturalWidth - sourceSize) / 2)
  const sy = Math.max(0, (image.naturalHeight - sourceSize) / 2)
  ctx.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, size, size)
  return canvas.toDataURL('image/jpeg', 0.82)
}

export function ProfilePage({ user, onLogout, onUpdateAvatar, onInstallApp, pwaInstalled = false }: Props) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [savingAvatar, setSavingAvatar] = useState(false)
  const [preview, setPreview] = useState(user.avatarUrl || '')
  const fileRef = useRef<HTMLInputElement>(null)
  const role = user.role === 'admin' ? 'QUẢN TRỊ HỆ THỐNG' : user.role === 'leader' ? 'TIỂU ĐỘI TRƯỞNG' : 'CHIẾN SĨ'
  const canEditAvatar = user.role === 'soldier' && Boolean(onUpdateAvatar)

  useEffect(() => setPreview(user.avatarUrl || ''), [user.avatarUrl])

  const chooseAvatar = () => fileRef.current?.click()
  const updateAvatar = async (file?: File) => {
    if (!file || !onUpdateAvatar) return
    setMessage('')
    setError('')
    if (!file.type.startsWith('image/')) { setError('Vui lòng chọn file ảnh JPG, PNG hoặc WEBP.'); return }
    if (file.size > 8 * 1024 * 1024) { setError('Ảnh quá lớn. Vui lòng chọn ảnh dưới 8 MB.'); return }

    try {
      setSavingAvatar(true)
      const nextPreview = await makeAvatarPreview(file)
      setPreview(nextPreview)
      const ok = await onUpdateAvatar(file, nextPreview)
      if (!ok) { setPreview(user.avatarUrl || ''); setError('Không thể cập nhật ảnh đại diện. Kiểm tra kết nối máy chủ rồi thử lại.'); return }
      setMessage('Đã cập nhật ảnh đại diện.')
    } catch (err) {
      setPreview(user.avatarUrl || '')
      setError(err instanceof Error ? err.message : 'Không thể cập nhật ảnh đại diện.')
    } finally {
      setSavingAvatar(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const avatarSrc = preview ? api.resolveAsset(preview) : ''

  return (
    <div className="page-stack">
      <section className="profile-command-card">
        <div className="profile-avatar-wrap">
          <div className={`profile-avatar ${avatarSrc ? 'has-photo' : ''}`}>
            {avatarSrc ? <img src={avatarSrc} alt={`Ảnh đại diện ${user.name}`} /> : <ShieldCheck size={31} />}
          </div>
          {canEditAvatar && <button className="profile-avatar-camera" type="button" onClick={chooseAvatar} disabled={savingAvatar} aria-label="Đổi ảnh đại diện">{savingAvatar ? <Loader2 size={17} className="login-spinner" /> : <Camera size={17} />}</button>}
        </div>
        <span className="military-kicker">HỒ SƠ CÁ NHÂN</span>
        <h1>{user.name}</h1>
        <p>{role} · {user.squad}</p>
        {canEditAvatar && <button className="avatar-upload-btn" type="button" onClick={chooseAvatar} disabled={savingAvatar}>{savingAvatar ? <><Loader2 size={15} className="login-spinner" /> ĐANG CẬP NHẬT...</> : <><ImagePlus size={15} /> CẬP NHẬT ẢNH ĐẠI DIỆN</>}</button>}
        {canEditAvatar && <input ref={fileRef} className="avatar-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void updateAvatar(event.target.files?.[0])} />}
      </section>
      <section className="profile-list">
        <button type="button" onClick={() => setMessage(`Tên đăng nhập: @${user.username}`)}><UserRound size={17} /><div><strong>Tên đăng nhập</strong><span>@{user.username}</span></div></button>
        <button type="button" onClick={() => setMessage(`Quyền hiện tại: ${role}`)}><ShieldCheck size={17} /><div><strong>Quyền truy cập</strong><span>{role}</span></div></button>
        <button type="button" onClick={() => setMessage('Đổi mật khẩu sẽ hoạt động sau khi kết nối API máy chủ.')}><KeyRound size={17} /><div><strong>Đổi mật khẩu</strong><span>Mở chức năng đổi mật khẩu</span></div></button>
        {onInstallApp && <button type="button" onClick={() => { if (pwaInstalled) { setMessage('Ứng dụng đã được cài trên thiết bị này.'); return } void onInstallApp() }}><Smartphone size={17} /><div><strong>{pwaInstalled ? 'Ứng dụng đã được cài' : 'Cài ứng dụng trên điện thoại'}</strong><span>{pwaInstalled ? 'Đang chạy ở chế độ ứng dụng độc lập' : 'Thêm biểu tượng ra màn hình chính'}</span></div>{pwaInstalled ? <CheckCircle2 size={16}/> : <Download size={16}/>}</button>}
      </section>
      {message && <div className="form-message success"><CheckCircle2 size={16} /> {message}</div>}
      {error && <div className="form-message error">{error}</div>}
      <button className="danger-wide-btn" type="button" onClick={onLogout}><LogOut size={17} /> ĐĂNG XUẤT</button>
    </div>
  )
}
