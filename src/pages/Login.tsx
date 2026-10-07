import { useState, type KeyboardEvent } from 'react'
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'

const REMEMBER_USERNAME_KEY = 'll47-remembered-username'

function readRememberedUsername() {
  try {
    return window.localStorage.getItem(REMEMBER_USERNAME_KEY) ?? ''
  } catch {
    return ''
  }
}

export function Login({ onLogin }: { onLogin: (username: string, password: string) => Promise<boolean> }) {
  const rememberedUsername = readRememberedUsername()
  const [username, setUsername] = useState(rememberedUsername)
  const [password, setPassword] = useState('')
  const [rememberAccount, setRememberAccount] = useState(Boolean(rememberedUsername))
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setRemember = (checked: boolean) => {
    setRememberAccount(checked)
    if (!checked) {
      try { window.localStorage.removeItem(REMEMBER_USERNAME_KEY) } catch { /* ignore storage errors */ }
    }
  }

  const submit = async () => {
    if (!username.trim() || !password.trim() || loading) return
    setError('')
    setLoading(true)

    // Cố ý giữ một nhịp loading ngắn để chuyển cảnh mượt hơn.
    await new Promise((resolve) => setTimeout(resolve, 850))
    const cleanUsername = username.trim()
    const ok = await onLogin(cleanUsername, password)

    if (ok) {
      try {
        if (rememberAccount) window.localStorage.setItem(REMEMBER_USERNAME_KEY, cleanUsername)
        else window.localStorage.removeItem(REMEMBER_USERNAME_KEY)
      } catch { /* ignore storage errors */ }
    } else {
      setError('Tên đăng nhập hoặc mật khẩu chưa đúng.')
    }

    setLoading(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') submit()
  }

  return (
    <div className="login-page">
      <div className="login-brand-mark"><ShieldCheck size={30} /></div>
      <div className="login-heading">
        <span>HỆ THỐNG TÁC NGHIỆP</span>
        <h1>Đăng nhập hệ thống</h1>
        <p>Xác thực tài khoản trước khi truy cập nhiệm vụ, đơn vị và bảng điều hành.</p>
      </div>

      <div className="login-card">
        <label>
          <span>Tên đăng nhập</span>
          <div className="field"><UserRound size={18} /><input value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={onKeyDown} autoComplete="username" /></div>
        </label>
        <label>
          <span>Mật khẩu</span>
          <div className="field password-field">
            <LockKeyhole size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={`password-visibility-btn ${showPassword ? 'is-visible' : ''}`}
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
              title={showPassword ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="login-options-row">
          <label className="remember-account-control">
            <input
              type="checkbox"
              checked={rememberAccount}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="remember-check" aria-hidden="true">{rememberAccount ? '✓' : ''}</span>
            <span>Nhớ tài khoản</span>
          </label>
          <span className="password-hint">Mật khẩu không được lưu</span>
        </div>

        {error && <div className="login-error">{error}</div>}

        <button className={`primary-btn login-btn ${loading ? 'is-loading' : ''}`} onClick={submit} disabled={loading}>
          {loading ? <><LoaderCircle className="login-spinner" size={18} /> Đang xác thực...</> : <>Đăng nhập <ArrowRight size={18} /></>}
        </button>
      </div>

    </div>
  )
}
