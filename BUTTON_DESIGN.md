# Thiết kế Button Layout - Quiz & Flashcard Detail Pages

## Tổng quan
Đã thiết kế lại layout của 4 button chính trong trang chi tiết Quiz và Flashcard để tối ưu trải nghiệm người dùng và giao diện responsive.

## Layout mới

### 1. Quiz Detail Page
- **Nút chính**: "Bắt đầu làm quiz" - màu xanh dương, kích thước lớn, nổi bật
- **Nút phụ**: 3 nút còn lại được nhóm thành icon buttons nhỏ gọn:
  - Copy Link (màu xanh lá)
  - Mời người dùng (màu tím) - chỉ hiện cho owner
  - Sửa Quiz (màu cam) - chỉ hiện cho owner

### 2. Flashcard Detail Page
- **Nút chính**: "Bắt đầu lại" - màu xanh dương, kích thước lớn, nổi bật
- **Nút phụ**: 2 nút còn lại được nhóm thành icon buttons:
  - Copy Link (màu xanh lá)
  - Mời người dùng (màu tím) - chỉ hiện cho owner

## Đặc điểm thiết kế

### Responsive Design
- **Desktop**: Layout ngang với nút chính bên trái, nút phụ bên phải
- **Mobile**: Layout dọc với nút chính full-width, nút phụ xếp ngang

### Visual Hierarchy
- **Nút chính**: 
  - Kích thước lớn (px-6 py-3)
  - Màu xanh dương nổi bật
  - Shadow và hover effects
  - Font weight semibold
  
- **Nút phụ**:
  - Kích thước nhỏ gọn (w-12 h-12)
  - Màu sắc nhẹ nhàng với background pastel
  - Icon-only design
  - Tooltip hiển thị khi hover

### Color Scheme
- **Primary**: Blue-600 (nút chính)
- **Copy Link**: Green-100/Green-600
- **Invite**: Purple-100/Purple-600
- **Edit**: Orange-100/Orange-600
- **Disabled**: Gray-100/Gray-400

### Interactive States
- Hover effects với shadow tăng
- Smooth transitions (duration-200)
- Disabled states với opacity giảm
- Tooltip hiển thị thông tin chi tiết

## Code Structure

### CSS Classes
```css
/* Nút chính */
px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl

/* Nút phụ */
w-12 h-12 rounded-xl bg-[color]-100 hover:bg-[color]-200 text-[color]-600 hover:text-[color]-700 shadow-md hover:shadow-lg

/* Responsive */
flex-col sm:flex-row items-start sm:items-center gap-4 w-full
```

### Layout Structure
```jsx
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
  {/* Primary Button */}
  <button className="primary-button-styles">...</button>
  
  {/* Secondary Actions */}
  <div className="flex items-center gap-2 w-full sm:w-auto">
    {/* Icon Buttons */}
  </div>
</div>
```

## Lợi ích

1. **UX tốt hơn**: Nút chính nổi bật, dễ tìm
2. **Responsive**: Hoạt động tốt trên mọi thiết bị
3. **Clean Design**: Giao diện gọn gàng, không bị rối mắt
4. **Consistent**: Đồng nhất giữa Quiz và Flashcard pages
5. **Accessible**: Tooltip và disabled states rõ ràng
