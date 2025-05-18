# BSCMSAAPUE Cinema - Hệ thống đặt vé xem phim

![BSCMSAAPUE Cinema](https://i.imgur.com/AvmwQ5D.jpg)

## Giới thiệu

BSCMSAAPUE Cinema là một hệ thống đặt vé xem phim trực tuyến, được xây dựng với công nghệ hiện đại, giúp người dùng dễ dàng xem thông tin phim, suất chiếu và đặt vé một cách nhanh chóng, thuận tiện.

## Tính năng chính

### Dành cho khách hàng

- Xem danh sách phim đang chiếu và sắp chiếu
- Xem thông tin chi tiết phim, trailer, đánh giá
- Xem lịch chiếu phim theo rạp, ngày, giờ
- Đặt vé xem phim trực tuyến
- Thanh toán trực tuyến qua VNPay
- Nhận mã QR vé điện tử
- Quản lý thông tin cá nhân và lịch sử đặt vé
- Chức năng trò chuyện với trợ lý ảo AI

### Dành cho quản trị viên

- Quản lý phim (thêm, sửa, xóa)
- Quản lý lịch chiếu
- Quản lý rạp và phòng chiếu
- Quản lý người dùng
- Quản lý đơn hàng
- Xem báo cáo thống kê
- Quản lý tin tức và khuyến mãi

## Công nghệ sử dụng

### Frontend

- React 18.2.0
- TypeScript
- Redux/Redux Toolkit
- Ant Design
- Styled Components
- React Router DOM
- Framer Motion (cho hiệu ứng)
- Axios

### Backend

- Java Spring Boot
- MySQL
- Spring Security + JWT
- REST API

### Hệ thống thanh toán

- Tích hợp cổng thanh toán VNPay

### AI Chatbot

- OpenAI API
- Context-aware responses

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 16.x trở lên
- Java 17 hoặc cao hơn
- MySQL

### Cài đặt Frontend

1. Clone repository

```
git clone https://github.com/username/BSCMSAAPUE-cinema.git
cd BSCMSAAPUE-cinema
```

2. Cài đặt dependencies

```
npm install
```

3. Cấu hình môi trường

- Tạo file `.env` từ file `.env.example`
- Cập nhật các thông số cần thiết, đặc biệt là `VITE_API_URL`

4. Chạy ứng dụng trong môi trường phát triển

```
npm run dev
```

5. Build cho môi trường production

```
npm run build
```

### Cài đặt Backend

1. Cấu hình database trong `application.properties`
2. Build và chạy ứng dụng Spring Boot

## Kiến trúc dự án

### Cấu trúc thư mục

- `/src/api`: Các service gọi API
- `/src/assets`: Chứa hình ảnh và tài nguyên tĩnh
- `/src/components`: Các component React có thể tái sử dụng
- `/src/hooks`: Custom hooks
- `/src/layouts`: Layout cho các trang
- `/src/pages`: Các trang của ứng dụng
- `/src/redux`: State management với Redux
- `/src/styles`: Styled-components và theme
- `/src/types`: TypeScript type definitions
- `/src/utils`: Các utility functions

## Hỗ trợ và liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ:

Email: support@BSCMSAAPUE.com
Website: https://BSCMSAAPUE.com
Hotline: 1900 xxxx

## Giấy phép

© 2024 BSCMSAAPUE Cinema. All rights reserved.
