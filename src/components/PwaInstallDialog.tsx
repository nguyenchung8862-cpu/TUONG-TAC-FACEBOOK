import { Download, MoreVertical, Share2, Smartphone, X } from 'lucide-react'
import type { InstallHelpMode } from '../hooks/usePwaInstall'

export function PwaInstallDialog({ mode, onClose }: { mode: InstallHelpMode; onClose: () => void }) {
  if (!mode) return null
  const ios = mode === 'ios'

  return (
    <div className="dialog-backdrop pwa-install-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="center-form-modal pwa-install-modal" role="dialog" aria-modal="true" aria-label="Cài ứng dụng">
        <div className="modal-head">
          <div>
            <span className="section-kicker">PWA / MOBILE</span>
            <h3>CÀI ỨNG DỤNG LÊN ĐIỆN THOẠI</h3>
          </div>
          <button className="dialog-close" type="button" onClick={onClose} aria-label="Đóng"><X size={17}/></button>
        </div>

        <div className="pwa-install-hero">
          <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="Biểu tượng ứng dụng Lực lượng 47" />
          <div><strong>SỞ CHỈ HUY LỰC LƯỢNG 47</strong><span>Chạy toàn màn hình như ứng dụng điện thoại</span></div>
        </div>

        {ios ? (
          <div className="pwa-install-steps">
            <div><span className="pwa-step-icon"><Share2 size={18}/></span><p><b>1.</b> Mở trang này bằng <strong>Safari</strong>, sau đó bấm nút <strong>Chia sẻ</strong>.</p></div>
            <div><span className="pwa-step-icon"><Smartphone size={18}/></span><p><b>2.</b> Chọn <strong>Thêm vào Màn hình chính</strong>.</p></div>
            <div><span className="pwa-step-icon"><Download size={18}/></span><p><b>3.</b> Bấm <strong>Thêm</strong>. Biểu tượng ứng dụng sẽ xuất hiện ngoài màn hình iPhone/iPad.</p></div>
          </div>
        ) : (
          <div className="pwa-install-steps">
            <div><span className="pwa-step-icon"><MoreVertical size={18}/></span><p><b>1.</b> Mở menu trình duyệt ở góc trên bên phải.</p></div>
            <div><span className="pwa-step-icon"><Download size={18}/></span><p><b>2.</b> Chọn <strong>Cài đặt ứng dụng</strong> hoặc <strong>Thêm vào màn hình chính</strong>.</p></div>
            <div><span className="pwa-step-icon"><Smartphone size={18}/></span><p><b>3.</b> Xác nhận cài đặt để mở hệ thống ở chế độ ứng dụng độc lập.</p></div>
          </div>
        )}

        <button className="primary-btn pwa-modal-close-btn" type="button" onClick={onClose}>ĐÃ HIỂU</button>
      </section>
    </div>
  )
}
