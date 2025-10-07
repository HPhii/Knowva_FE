# Cấu hình biến môi trường

## Thiết lập biến môi trường

Để sử dụng chức năng Copy Link, bạn cần tạo file `.env` trong thư mục gốc của dự án với nội dung sau:

```env
# Base URL for the application
VITE_BASE_URL=https://knowva.me
```

## Cách sử dụng

1. Tạo file `.env` trong thư mục gốc của dự án
2. Thêm biến `VITE_BASE_URL` với URL của ứng dụng
3. Khởi động lại ứng dụng để áp dụng thay đổi

## Lưu ý

- Biến môi trường phải bắt đầu với `VITE_` để có thể sử dụng trong ứng dụng React
- Nếu không có file `.env`, ứng dụng sẽ sử dụng URL mặc định `https://knowva.me`
- URL này được sử dụng để tạo link chia sẻ cho quiz và flashcard sets
