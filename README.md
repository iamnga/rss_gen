# VIB RSS Feed Generator

Website để tạo và quản lý RSS feed cho việc test Power Automate flow phân tích sentiment tin tức VIB.

## 📋 Tính năng

- ✅ Tạo RSS feed theo chuẩn RSS 2.0 (tương tự VNExpress)
- ✅ Thêm tin tức mới một cách dễ dàng với form trực quan
- ✅ Xóa tin tức không cần thiết
- ✅ UI thân thiện với màu sắc theo brand VIB
- ✅ Feed tự động cập nhật real-time khi có tin mới
- ✅ Copy RSS Feed URL dễ dàng
- ✅ Hiển thị metadata đầy đủ (tác giả, danh mục, ngày xuất bản)

## 🎨 Màu sắc

- **Primary color**: `#2b6cae` (Xanh VIB)
- **Secondary color**: `#f19b38` (Cam)
- **Background**: `#fefefe` (Trắng)
- **Accent/light section**: `#92b5d7` (Xanh nhạt)

## 🚀 Cài đặt

```bash
npm install
```

## ▶️ Chạy ứng dụng

### Chạy Local

```bash
npm start
```

Website sẽ chạy tại: **http://localhost:3000**

RSS Feed URL: **http://localhost:3000/feed.xml**

### 🚀 Deploy lên Vercel (Recommended)

Để sử dụng công khai và tích hợp với Power Automate, nên deploy lên Vercel:

#### Bước 1: Cài đặt Vercel CLI (tùy chọn)
```bash
npm i -g vercel
```

#### Bước 2: Deploy
**Cách 1: Sử dụng Vercel Dashboard (Dễ nhất)**
1. Truy cập [vercel.com](https://vercel.com)
2. Login bằng GitHub
3. Click "New Project"
4. Import repository `rss_gen`
5. Click "Deploy" (không cần config gì thêm)
6. Đợi vài giây để deploy xong
7. Copy URL từ Vercel (VD: `https://your-project.vercel.app`)
8. Sử dụng URL này trong Power Automate: `https://your-project.vercel.app/feed.xml`

**Cách 2: Sử dụng Vercel CLI**
```bash
vercel
```

Follow các bước trong CLI, sau đó:
```bash
vercel --prod
```

#### ⚠️ Lưu ý quan trọng về Vercel deployment:
- **Data lưu trong memory**: Trên Vercel, data được lưu trong memory của serverless function. Data sẽ tồn tại trong session nhưng có thể reset khi:
  - Function cold start (sau một thời gian không hoạt động)
  - Khi deploy version mới
  - Khi Vercel scale functions
- **Phù hợp cho testing**: Điều này hoàn toàn OK cho mục đích test Power Automate flow
- **Initial data**: Mỗi lần reset sẽ có 2 tin mẫu sẵn để test ngay
- **Production use**: Nếu cần lưu data vĩnh viễn, có thể tích hợp database (MongoDB, PostgreSQL, etc.)

## 📖 Hướng dẫn sử dụng

### 1. Khởi động website
```bash
npm start
```

### 2. Truy cập giao diện web
Mở trình duyệt và truy cập: http://localhost:3000

### 3. Thêm tin tức mới
- Điền đầy đủ thông tin:
  - **Tiêu đề** (bắt buộc): Tiêu đề tin tức
  - **Mô tả/Nội dung** (bắt buộc): Nội dung chi tiết của tin
  - **Link bài viết** (bắt buộc): URL của bài viết
  - **Tác giả** (tùy chọn): Tên tác giả
  - **Danh mục** (tùy chọn): Phân loại tin (VD: Tài chính, Kinh tế...)
  - **Ngày xuất bản** (tùy chọn): Mặc định là thời điểm hiện tại
- Click **"Thêm tin"**

### 4. Sử dụng RSS Feed trong Power Automate
- Copy RSS Feed URL từ giao diện (click nút "Copy")
- Paste URL vào Power Automate flow: `http://localhost:3000/feed.xml`
- Flow sẽ tự động nhận tin mới mỗi khi bạn thêm vào website

### 5. Quản lý tin tức
- Xem danh sách tất cả tin đã thêm ở panel bên phải
- Click **"Xóa"** để xóa tin không cần thiết
- Số lượng tin hiện tại được hiển thị ở badge màu cam

## 🏗️ Cấu trúc dự án

```
rss_gen/
├── server.js           # Express server (cho local development)
├── vercel.json         # Vercel configuration
├── package.json        # Dependencies
├── api/               # Serverless functions (cho Vercel)
│   ├── data-store.js  # In-memory data storage
│   ├── items.js       # API endpoint: GET/POST/DELETE items
│   ├── feed.js        # API endpoint: Generate RSS feed
│   └── feed-info.js   # API endpoint: Manage feed info
├── public/            # Frontend files
│   ├── index.html     # Giao diện chính
│   ├── style.css      # Styles với màu VIB
│   └── app.js         # Frontend logic
└── README.md          # Tài liệu
```

## 🔧 API Endpoints

### GET `/api/items`
Lấy danh sách tất cả tin tức

### POST `/api/items`
Thêm tin tức mới
```json
{
  "title": "Tiêu đề",
  "description": "Mô tả",
  "link": "https://example.com",
  "author": "Tác giả",
  "category": "Danh mục",
  "pubDate": "2024-01-15T10:00:00.000Z"
}
```

### DELETE `/api/items/:id`
Xóa tin tức theo ID

### GET `/feed.xml`
Lấy RSS feed (XML format)

## 📝 Ví dụ RSS Feed Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>VIB News Feed - Test</title>
    <link>http://localhost:3000</link>
    <description>RSS Feed for testing VIB sentiment analysis flow</description>
    <language>vi</language>
    <item>
      <title>VIB ra mắt sản phẩm mới</title>
      <link>https://example.com/vib-news</link>
      <description>Nội dung tin tức...</description>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <guid isPermaLink="false">item-1234567890</guid>
      <dc:creator>Biên tập viên</dc:creator>
      <category>Tài chính</category>
    </item>
  </channel>
</rss>
```

## 🔍 Lưu ý

- Data được lưu trong file `data.json` (tự động tạo)
- Mỗi lần restart server, data vẫn được giữ nguyên
- Feed được sắp xếp theo thứ tự mới nhất trước
- Hỗ trợ tiếng Việt đầy đủ
- Chuẩn RSS 2.0 tương thích với mọi RSS reader

## 🎯 Use Case: Test với Power Automate

1. Start server: `npm start`
2. Thêm tin tức test vào website
3. Power Automate flow sẽ trigger khi phát hiện tin mới
4. Flow phân tích sentiment (tốt/xấu) cho khách hàng VIB
5. Kết quả được gửi vào Teams group

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
- Node.js đã được cài đặt (v14 trở lên)
- Port 3000 không bị chiếm bởi app khác
- File `data.json` có quyền write
