# Sở Chỉ Huy Lực Lượng 47 — PWA V4.11

Bản này giữ nguyên giao diện và chức năng của V4.10, đồng thời hoàn thiện lớp PWA để có thể cài lên điện thoại từ GitHub Pages.

## Chạy giao diện trên máy tính

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị, thường là `http://localhost:5173`.

## Build

```bash
npm run build
```

Thư mục `dist/` là bản frontend để deploy.

## Deploy GitHub Pages

Project đã có `.github/workflows/deploy.yml`. Đẩy source lên nhánh `main`, sau đó trong GitHub vào **Settings → Pages → Source: GitHub Actions**.

Sau khi workflow chạy xong, mở đường dẫn HTTPS của GitHub Pages trên điện thoại.

## Cài trên Android

1. Mở website bằng Chrome/Edge.
2. Đăng nhập → vào **Cá nhân** (hoặc **Hệ thống** nếu là Admin).
3. Bấm **Cài ứng dụng trên điện thoại / Cài ứng dụng PWA**.
4. Xác nhận cài đặt.

Nếu trình duyệt không hiện hộp cài tự động: mở menu `⋮` → **Cài đặt ứng dụng** hoặc **Thêm vào màn hình chính**.

## Cài trên iPhone/iPad

1. Mở website bằng Safari.
2. Đăng nhập → vào **Cá nhân** → **Cài ứng dụng trên điện thoại** để xem hướng dẫn.
3. Trên Safari bấm **Chia sẻ** → **Thêm vào Màn hình chính** → **Thêm**.

## PWA trong bản này

- Tên ứng dụng: **Sở Chỉ Huy Lực Lượng 47 - Bù Gia Mập**.
- Icon PWA 192px / 512px, icon maskable Android và Apple Touch Icon.
- Chạy `display: standalone` như ứng dụng độc lập.
- Hỗ trợ safe-area iPhone.
- Service worker cache giao diện/static assets để app shell vẫn mở được khi mất mạng.
- Không cache request API từ máy chủ khác, tránh dùng nhầm dữ liệu tác nghiệp cũ.
- Nút cài PWA thật trong Hồ sơ cá nhân và Hệ thống Admin.
- Có hướng dẫn riêng nếu iPhone/Safari hoặc trình duyệt không hỗ trợ install prompt trực tiếp.

> Dữ liệu thật vẫn nằm ở backend laptop như kiến trúc đã chốt. PWA chỉ là lớp giao diện được cài lên điện thoại.

## V4.14 — tối ưu iPhone / safe-area
- Header và bottom navigation tràn nền vào vùng Dynamic Island / Home Indicator thay vì tạo dải đen riêng.
- Giảm chiều cao phần chrome trên điện thoại nhưng vẫn giữ nội dung tránh vùng cảm ứng hệ thống.
- Trang đăng nhập không cộng thêm khoảng trống 34px ngoài safe-area nữa.
- Toàn bộ giao diện và chức năng V4.11 được giữ nguyên.


## V4.14 — iPhone bottom safe-area fix
- Bottom navigation no longer adds the full Home Indicator inset to its height.
- Mobile shell is pinned with `inset: 0` to the real viewport to prevent an exposed black strip.
- PWA cache version bumped so iPhone receives the new CSS instead of the previous cached build.


## V4.14 iOS edge-to-edge
- Thanh điều hướng dưới giảm còn 52px, không cộng safe-area vào chiều cao.
- Nội dung kéo sát mép dưới hơn; nền app phủ xuyên vùng Home Indicator.
- Nếu kiểm tra trong Safari thay vì PWA đã cài, thanh công cụ của Safari vẫn là UI hệ thống và không thể xóa bằng CSS.
