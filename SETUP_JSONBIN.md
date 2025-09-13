# Hướng dẫn cài đặt JSONBin để lưu trữ dữ liệu

## Bước 1: Tạo tài khoản JSONBin.io
1. Truy cập: https://jsonbin.io
2. Đăng ký tài khoản miễn phí
3. Xác nhận email

## Bước 2: Tạo Bin mới
1. Đăng nhập vào JSONBin.io
2. Click "Create Bin"
3. Tạo một bin với nội dung: `[]` (mảng rỗng)
4. Lưu lại **Bin ID** (ví dụ: 507f1f77bcf86cd799439011)

## Bước 3: Lấy API Key
1. Vào trang Profile/Settings
2. Copy **Master Key** (API Key)

## Bước 4: Cập nhật code
Mở file `script.js` và thay thế:
- `YOUR_API_KEY_HERE` bằng Master Key của bạn
- `YOUR_BIN_ID_HERE` bằng Bin ID của bạn

Ví dụ:
```javascript
const JSONBIN_API_KEY = '$2a$10$abc123...'; // Master Key của bạn
const JSONBIN_BIN_ID = '507f1f77bcf86cd799439011'; // Bin ID của bạn
```

## Bước 5: Test
1. Lưu file và refresh trang web
2. Thử thêm một lịch nhậu mới
3. Mở điện thoại và truy cập cùng URL để xem dữ liệu

## Lưu ý:
- JSONBin miễn phí cho 10,000 requests/tháng
- Dữ liệu sẽ được đồng bộ giữa tất cả thiết bị
- Nếu JSONBin lỗi, app sẽ tự động dùng localStorage làm backup
