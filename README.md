# VIB RSS Feed Generator

Website tạo và quản lý RSS feed cho việc test Power Automate flow phân tích sentiment tin tức VIB.

**🚀 Thiết kế 100% cho Vercel Serverless**

## 📋 Tính năng

- ✅ Tạo RSS feed theo chuẩn RSS 2.0 (tương tự VNExpress)
- ✅ Thêm tin tức mới dễ dàng với form trực quan
- ✅ Xóa tin tức không cần thiết
- ✅ UI thân thiện với màu sắc theo brand VIB
- ✅ Feed tự động cập nhật real-time
- ✅ Copy RSS Feed URL một cú click
- ✅ Hiển thị metadata đầy đủ (tác giả, danh mục, ngày xuất bản)
- ✅ Serverless architecture - không cần maintain server

## 🎨 Màu sắc VIB

- **Primary**: `#2b6cae` (Xanh VIB)
- **Secondary**: `#f19b38` (Cam)
- **Background**: `#fefefe` (Trắng)
- **Accent**: `#92b5d7` (Xanh nhạt)

## 🚀 Deploy lên Vercel (Chỉ 2 phút!)

### Cách 1: Vercel Dashboard (Khuyến nghị - Dễ nhất)

1. Truy cập [vercel.com](https://vercel.com) và login bằng GitHub
2. Click **"New Project"**
3. Import repository `iamnga/rss_gen`
4. Branch: `claude/build-news-sentiment-website-01FzoTLaEcQfLk7z72iZ1Mce`
5. Click **"Deploy"** (không cần config gì!)
6. Đợi 1-2 phút để build xong
7. Copy URL (VD: `https://rss-gen-xyz.vercel.app`)
8. Sử dụng ngay!

**RSS Feed URL**: `https://your-project.vercel.app/feed.xml`

### Cách 2: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

## 📖 Cách sử dụng

### 1. Truy cập website
Mở URL Vercel của bạn (VD: https://rss-gen-rose.vercel.app)

### 2. Thêm tin tức test
- **Tiêu đề** (bắt buộc): Nhập tiêu đề tin tức
- **Mô tả/Nội dung** (bắt buộc): Nội dung chi tiết
- **Link bài viết** (bắt buộc): URL bài viết gốc
- **Tác giả** (tùy chọn): Tên tác giả
- **Danh mục** (tùy chọn): Phân loại tin (Tài chính, Kinh tế...)
- **Ngày xuất bản** (tùy chọn): Mặc định là hiện tại
- Click **"Thêm tin"**

### 3. Tích hợp Power Automate
1. Click nút **"Copy"** để copy RSS Feed URL
2. Paste vào Power Automate flow trigger: `https://your-project.vercel.app/feed.xml`
3. Flow sẽ tự động nhận tin mới khi bạn thêm
4. Phân tích sentiment và gửi vào Teams

### 4. Quản lý tin tức
- Xem danh sách tin bên phải
- Click **"Xóa"** để xóa tin không cần
- Badge cam hiển thị tổng số tin

## 🏗️ Cấu trúc (Vercel-optimized)

```
rss_gen/
├── index.html         # Trang chính (auto-serve tại /)
├── style.css          # CSS với màu VIB
├── app.js             # Frontend logic
├── package.json       # Dependencies
└── api/              # Serverless Functions
    ├── items.js      # API: quản lý tin tức
    ├── feed.js       # API: generate RSS XML
    └── feed-info.js  # API: metadata feed
```

**Zero config**: Vercel tự động detect và deploy theo convention!

## 🔧 API Endpoints

### `GET /api/items`
Lấy danh sách tất cả tin tức

### `POST /api/items`
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

### `DELETE /api/items?id={id}`
Xóa tin tức theo ID

### `GET /feed.xml`
Lấy RSS feed (XML format)

## 📝 Ví dụ RSS Feed Output

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>VIB News Feed - Test</title>
    <link>https://rss-gen-rose.vercel.app</link>
    <description>RSS Feed for testing VIB sentiment analysis flow</description>
    <language>vi</language>
    <lastBuildDate>Thu, 21 Nov 2024 06:00:00 GMT</lastBuildDate>
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

## 🔍 Lưu ý quan trọng về Data

### Data Storage trên Vercel
- **Lưu trong memory**: Data được lưu trong `global.feedData` của serverless function
- **Reset khi cold start**: Sau ~15 phút không dùng, function sleep và data reset
- **2 tin mẫu sẵn**: Mỗi lần cold start có 2 tin VIB để test ngay
- **Phù hợp testing**: Hoàn hảo cho mục đích test Power Automate flow

### Khi nào data reset?
- Function cold start (sau thời gian không hoạt động)
- Deploy version mới
- Vercel scale/restart functions

### Tại sao phù hợp cho testing?
✅ Luôn có data mẫu để test
✅ Không cần setup database
✅ Đơn giản, nhanh, miễn phí
✅ Thêm tin test bất cứ lúc nào

## 🎯 Use Case: Test Power Automate Flow

1. **Deploy** website lên Vercel (2 phút)
2. **Thêm tin test** về VIB (tích cực hoặc tiêu cực)
3. **Copy RSS Feed URL** từ website
4. **Paste vào Power Automate** flow trigger
5. **Flow tự động chạy** khi phát hiện tin mới
6. **Phân tích sentiment** (tốt/xấu cho khách hàng VIB)
7. **Gửi vào Teams** group để team nắm thông tin

## 💾 Production với Database (Optional)

Nếu cần lưu data vĩnh viễn, tích hợp database:

**Khuyến nghị cho Vercel:**
- **Vercel KV** (Redis-based) - Nhanh, dễ setup
- **Vercel Postgres** - SQL database
- **Upstash Redis** - Serverless Redis
- **MongoDB Atlas** - NoSQL
- **Supabase** - PostgreSQL + Realtime

Chỉ cần update `api/*.js` để connect database thay vì dùng `global.feedData`.

## 📞 Troubleshooting

### Website không load?
1. Check Vercel Dashboard > Deployments
2. Xem deployment status (Building/Ready/Error)
3. Click vào deployment > Logs để xem chi tiết

### API trả về lỗi?
1. Vercel Dashboard > Functions > Logs
2. Xem error message và stack trace
3. Kiểm tra CORS headers đã được set

### Data bị mất?
- Đây là behavior bình thường của serverless memory storage
- Data reset khi cold start (sau ~15 phút không dùng)
- 2 tin mẫu sẽ tự động xuất hiện lại

### Deploy failed?
1. Kiểm tra code đã push lên GitHub chưa
2. Vercel đã connect đúng repository chưa
3. Branch đúng chưa
4. Xem build logs để debug

## 🌟 Tính năng nổi bật

✅ **Zero config** - Không cần setup phức tạp
✅ **Auto deploy** - Push code là tự động deploy
✅ **Global CDN** - Nhanh khắp thế giới
✅ **HTTPS miễn phí** - Secure by default
✅ **Serverless** - Chỉ trả tiền khi dùng (free tier rất hào phóng)
✅ **Chuẩn RSS 2.0** - Tương thích với mọi RSS reader

---

**Made for VIB** with Vercel Serverless ⚡
