# AdminDashboard Component

## Tổng quan
AdminDashboard là một giao diện quản trị hoàn chỉnh được xây dựng bằng ReactJS + Ant Design + Tailwind CSS, hỗ trợ đa ngôn ngữ (Tiếng Anh và Tiếng Việt).

## Tính năng chính

### 1. Layout
- **Header**: Hiển thị tên hệ thống, nút toggle sidebar, và thông tin admin
- **Sider**: Menu điều hướng với 3 mục chính
- **Content**: Nội dung tương ứng với menu đã chọn

### 2. Quản lý User 👤
- Hiển thị danh sách user với bảng dữ liệu
- Tìm kiếm và lọc theo Role/Status
- Chỉnh sửa và xóa user
- Thống kê số lượng user theo trạng thái

### 3. Quản lý Blog 📝
- Hiển thị danh sách blog
- Thêm blog mới với form đầy đủ
- Chỉnh sửa và xóa blog
- Lọc theo trạng thái (Draft/Published/Archived)

### 4. Quản lý Báo cáo lỗi ⚠️
- Hiển thị danh sách báo cáo
- Xem chi tiết báo cáo
- Cập nhật trạng thái xử lý
- Phân loại theo độ ưu tiên

## Cách sử dụng

### 1. Truy cập
```
http://localhost:3000/admin
```

### 2. Chuyển đổi ngôn ngữ
- Click vào icon 🌐 ở header
- Chọn ngôn ngữ mong muốn

### 3. Điều hướng
- Sử dụng menu bên trái để chuyển đổi giữa các chức năng
- Click vào nút hamburger để thu gọn/mở rộng sidebar

## Cấu trúc file

```
src/pages/AdminDashboard/
├── AdminDashboard.jsx          # Component chính
├── components/
│   ├── UserManagement.jsx      # Quản lý User
│   ├── BlogManagement.jsx      # Quản lý Blog
│   └── ReportManagement.jsx    # Quản lý Báo cáo
├── index.js                    # Export component
└── README.md                   # Hướng dẫn sử dụng
```

## Dependencies

- **React**: ^19.1.0
- **Ant Design**: ^5.26.7
- **Tailwind CSS**: ^4.1.11
- **React i18next**: ^15.6.1

## Tùy chỉnh

### 1. Thay đổi theme
- Sửa đổi các class Tailwind CSS trong components
- Thay đổi màu sắc trong AdminDashboard.jsx

### 2. Thêm chức năng mới
- Tạo component mới trong thư mục components/
- Thêm vào menu và renderContent() trong AdminDashboard.jsx

### 3. Kết nối API
- Thay thế mock data bằng API calls thực tế
- Sử dụng axios hoặc fetch để gọi API

## Responsive Design

- **Desktop**: Hiển thị đầy đủ sidebar và content
- **Tablet**: Sidebar thu gọn, content responsive
- **Mobile**: Sidebar ẩn, content full-width

## Lưu ý

- Tất cả dữ liệu hiện tại là mock data, cần thay thế bằng API thực tế
- Các chức năng CRUD cần implement logic xử lý backend
- Có thể thêm authentication/authorization để bảo vệ admin routes
