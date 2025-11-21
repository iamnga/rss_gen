// Main page serverless function
module.exports = async (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VIB RSS Feed Generator</title>
    <style>
/* VIB Brand Colors */
:root {
    --primary-color: #2b6cae;
    --secondary-color: #f19b38;
    --background: #fefefe;
    --accent: #92b5d7;
    --text-dark: #333;
    --text-light: #666;
    --border: #e0e0e0;
    --shadow: rgba(0, 0, 0, 0.1);
    --success: #28a745;
    --danger: #dc3545;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: var(--background);
    color: var(--text-dark);
    line-height: 1.6;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

header {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, var(--primary-color), var(--accent));
    border-radius: 12px;
    margin-bottom: 30px;
    color: white;
    box-shadow: 0 4px 12px var(--shadow);
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.subtitle {
    font-size: 1.1rem;
    opacity: 0.95;
}

.feed-info-section {
    background: var(--accent);
    padding: 25px;
    border-radius: 12px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px var(--shadow);
}

.feed-url-box label {
    display: block;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--primary-color);
}

.url-display {
    display: flex;
    gap: 10px;
}

.url-display input {
    flex: 1;
    padding: 12px;
    border: 2px solid var(--primary-color);
    border-radius: 6px;
    font-size: 1rem;
    background: white;
    font-family: 'Courier New', monospace;
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

@media (max-width: 968px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}

.card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 12px var(--shadow);
    border: 1px solid var(--border);
}

.card h2 {
    color: var(--primary-color);
    margin-bottom: 20px;
    font-size: 1.5rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.card-header h2 {
    margin-bottom: 0;
}

.badge {
    background: var(--secondary-color);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-dark);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--border);
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
    font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
}

.form-group textarea {
    resize: vertical;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.btn-primary,
.btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
    width: 100%;
    justify-content: center;
}

.btn-primary:hover {
    background: #234f85;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow);
}

.btn-secondary {
    background: var(--secondary-color);
    color: white;
}

.btn-secondary:hover {
    background: #d68729;
}

.news-list {
    max-height: 600px;
    overflow-y: auto;
}

.empty-state {
    text-align: center;
    color: var(--text-light);
    padding: 40px;
    font-style: italic;
}

.news-item {
    padding: 20px;
    border: 2px solid var(--border);
    border-radius: 8px;
    margin-bottom: 15px;
    background: var(--background);
    transition: all 0.3s;
}

.news-item:hover {
    border-color: var(--accent);
    box-shadow: 0 2px 8px var(--shadow);
}

.news-item h3 {
    color: var(--primary-color);
    font-size: 1.1rem;
    margin-bottom: 8px;
}

.news-item-meta {
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 10px;
}

.news-item-description {
    color: var(--text-dark);
    margin-bottom: 10px;
    line-height: 1.5;
}

.news-item-link {
    color: var(--primary-color);
    text-decoration: none;
    font-size: 0.9rem;
    display: inline-block;
    margin-bottom: 10px;
    word-break: break-all;
}

.news-item-link:hover {
    text-decoration: underline;
}

.news-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border);
}

.news-item-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tag {
    background: var(--accent);
    color: var(--primary-color);
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
}

.btn-delete {
    background: var(--danger);
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.3s;
}

.btn-delete:hover {
    background: #c82333;
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    background: var(--success);
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 12px var(--shadow);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s;
    z-index: 1000;
}

.notification.show {
    opacity: 1;
    transform: translateY(0);
}

.notification.error {
    background: var(--danger);
}

footer {
    text-align: center;
    padding: 20px;
    color: var(--text-light);
    font-size: 0.9rem;
}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>VIB RSS Feed Generator</h1>
            <p class="subtitle">Công cụ tạo RSS feed để test Power Automate flow</p>
        </header>

        <div class="feed-info-section">
            <div class="feed-url-box">
                <label>RSS Feed URL:</label>
                <div class="url-display">
                    <input type="text" id="feedUrl" readonly value="">
                    <button onclick="copyFeedUrl()" class="btn-secondary">Copy</button>
                </div>
            </div>
        </div>

        <div class="content-grid">
            <div class="card">
                <h2>Thêm tin tức mới</h2>
                <form id="addNewsForm">
                    <div class="form-group">
                        <label for="title">Tiêu đề *</label>
                        <input type="text" id="title" name="title" required placeholder="Nhập tiêu đề tin tức...">
                    </div>

                    <div class="form-group">
                        <label for="description">Mô tả / Nội dung *</label>
                        <textarea id="description" name="description" rows="4" required placeholder="Nhập nội dung chi tiết..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="link">Link bài viết *</label>
                        <input type="url" id="link" name="link" required placeholder="https://example.com/bai-viet">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="author">Tác giả</label>
                            <input type="text" id="author" name="author" placeholder="Tên tác giả">
                        </div>

                        <div class="form-group">
                            <label for="category">Danh mục</label>
                            <input type="text" id="category" name="category" placeholder="Kinh tế, Tài chính...">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="pubDate">Ngày xuất bản</label>
                        <input type="datetime-local" id="pubDate" name="pubDate">
                    </div>

                    <button type="submit" class="btn-primary">+ Thêm tin</button>
                </form>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2>Danh sách tin tức</h2>
                    <span id="newsCount" class="badge">0 tin</span>
                </div>
                <div id="newsList" class="news-list">
                    <p class="empty-state">Chưa có tin tức nào. Hãy thêm tin mới!</p>
                </div>
            </div>
        </div>

        <footer>
            <p>VIB RSS Feed Generator &copy; 2024</p>
        </footer>
    </div>

    <div id="notification" class="notification"></div>

    <script>
const API_BASE = window.location.origin;
const FEED_URL = \`\${API_BASE}/feed.xml\`;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('feedUrl').value = FEED_URL;
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('pubDate').value = now.toISOString().slice(0, 16);
    loadNews();
    document.getElementById('addNewsForm').addEventListener('submit', handleAddNews);
});

async function loadNews() {
    try {
        const response = await fetch(\`\${API_BASE}/api/items\`);
        const items = await response.json();
        displayNews(items);
        updateNewsCount(items.length);
    } catch (error) {
        console.error('Error loading news:', error);
        showNotification('Không thể tải danh sách tin tức', 'error');
    }
}

function displayNews(items) {
    const newsList = document.getElementById('newsList');
    if (items.length === 0) {
        newsList.innerHTML = '<p class="empty-state">Chưa có tin tức nào. Hãy thêm tin mới!</p>';
        return;
    }
    newsList.innerHTML = items.map(item => \`
        <div class="news-item">
            <h3>\${escapeHtml(item.title)}</h3>
            <div class="news-item-meta">\${formatDate(item.pubDate)}</div>
            <div class="news-item-description">\${escapeHtml(item.description)}</div>
            <a href="\${escapeHtml(item.link)}" target="_blank" class="news-item-link">\${escapeHtml(item.link)}</a>
            <div class="news-item-footer">
                <div class="news-item-tags">
                    \${item.author ? \`<span class="tag">👤 \${escapeHtml(item.author)}</span>\` : ''}
                    \${item.category ? \`<span class="tag">📁 \${escapeHtml(item.category)}</span>\` : ''}
                </div>
                <button onclick="deleteNews('\${item.id}')" class="btn-delete">Xóa</button>
            </div>
        </div>
    \`).join('');
}

async function handleAddNews(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newsItem = {
        title: formData.get('title'),
        description: formData.get('description'),
        link: formData.get('link'),
        author: formData.get('author'),
        category: formData.get('category'),
        pubDate: formData.get('pubDate') ? new Date(formData.get('pubDate')).toISOString() : new Date().toISOString()
    };
    try {
        const response = await fetch(\`\${API_BASE}/api/items\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newsItem)
        });
        const result = await response.json();
        if (result.success) {
            showNotification('Đã thêm tin tức thành công!');
            e.target.reset();
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('pubDate').value = now.toISOString().slice(0, 16);
            loadNews();
        } else {
            showNotification('Không thể thêm tin tức', 'error');
        }
    } catch (error) {
        console.error('Error adding news:', error);
        showNotification('Có lỗi xảy ra khi thêm tin tức', 'error');
    }
}

async function deleteNews(id) {
    if (!confirm('Bạn có chắc muốn xóa tin này?')) return;
    try {
        const response = await fetch(\`\${API_BASE}/api/items?id=\${id}\`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) {
            showNotification('Đã xóa tin tức');
            loadNews();
        } else {
            showNotification('Không thể xóa tin tức', 'error');
        }
    } catch (error) {
        console.error('Error deleting news:', error);
        showNotification('Có lỗi xảy ra khi xóa tin tức', 'error');
    }
}

async function copyFeedUrl() {
    const feedUrlInput = document.getElementById('feedUrl');
    try {
        await navigator.clipboard.writeText(feedUrlInput.value);
        showNotification('Đã copy RSS Feed URL!');
        feedUrlInput.select();
        setTimeout(() => window.getSelection().removeAllRanges(), 1000);
    } catch (error) {
        feedUrlInput.select();
        document.execCommand('copy');
        showNotification('Đã copy RSS Feed URL!');
    }
}

function updateNewsCount(count) {
    document.getElementById('newsCount').textContent = \`\${count} tin\`;
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = \`notification \${type}\`;
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(html);
};
