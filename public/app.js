// API Base URL
const API_BASE = window.location.origin;
const FEED_URL = `${API_BASE}/feed.xml`;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Set feed URL
    document.getElementById('feedUrl').value = FEED_URL;

    // Set default datetime to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('pubDate').value = now.toISOString().slice(0, 16);

    // Load news items
    loadNews();

    // Setup form handler
    document.getElementById('addNewsForm').addEventListener('submit', handleAddNews);
}

// Load all news items
async function loadNews() {
    try {
        const response = await fetch(`${API_BASE}/api/items`);
        const items = await response.json();

        displayNews(items);
        updateNewsCount(items.length);
    } catch (error) {
        console.error('Error loading news:', error);
        showNotification('Không thể tải danh sách tin tức', 'error');
    }
}

// Display news items
function displayNews(items) {
    const newsList = document.getElementById('newsList');

    if (items.length === 0) {
        newsList.innerHTML = '<p class="empty-state">Chưa có tin tức nào. Hãy thêm tin mới!</p>';
        return;
    }

    newsList.innerHTML = items.map(item => `
        <div class="news-item" data-id="${item.id}">
            <div class="news-item-header">
                <h3>${escapeHtml(item.title)}</h3>
            </div>
            <div class="news-item-meta">
                ${formatDate(item.pubDate)}
            </div>
            <div class="news-item-description">
                ${escapeHtml(item.description)}
            </div>
            <a href="${escapeHtml(item.link)}" target="_blank" class="news-item-link">
                ${escapeHtml(item.link)}
            </a>
            <div class="news-item-footer">
                <div class="news-item-tags">
                    ${item.author ? `<span class="tag">👤 ${escapeHtml(item.author)}</span>` : ''}
                    ${item.category ? `<span class="tag">📁 ${escapeHtml(item.category)}</span>` : ''}
                </div>
                <button onclick="deleteNews('${item.id}')" class="btn-delete">Xóa</button>
            </div>
        </div>
    `).join('');
}

// Handle add news form submission
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
        const response = await fetch(`${API_BASE}/api/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsItem)
        });

        const result = await response.json();

        if (result.success) {
            showNotification('Đã thêm tin tức thành công!');
            e.target.reset();

            // Reset datetime to now
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('pubDate').value = now.toISOString().slice(0, 16);

            // Reload news list
            loadNews();
        } else {
            showNotification('Không thể thêm tin tức', 'error');
        }
    } catch (error) {
        console.error('Error adding news:', error);
        showNotification('Có lỗi xảy ra khi thêm tin tức', 'error');
    }
}

// Delete news item
async function deleteNews(id) {
    if (!confirm('Bạn có chắc muốn xóa tin này?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/items/${id}`, {
            method: 'DELETE'
        });

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

// Copy feed URL to clipboard
async function copyFeedUrl() {
    const feedUrlInput = document.getElementById('feedUrl');

    try {
        await navigator.clipboard.writeText(feedUrlInput.value);
        showNotification('Đã copy RSS Feed URL!');

        // Visual feedback
        feedUrlInput.select();
        setTimeout(() => {
            window.getSelection().removeAllRanges();
        }, 1000);
    } catch (error) {
        // Fallback for older browsers
        feedUrlInput.select();
        document.execCommand('copy');
        showNotification('Đã copy RSS Feed URL!');
    }
}

// Update news count badge
function updateNewsCount(count) {
    document.getElementById('newsCount').textContent = `${count} tin`;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('vi-VN', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
