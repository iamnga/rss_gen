const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize data file if it doesn't exist
function initDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      feedInfo: {
        title: "VIB News Feed - Test",
        link: "http://localhost:3000",
        description: "RSS Feed for testing VIB sentiment analysis flow",
        language: "vi"
      },
      items: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { feedInfo: {}, items: [] };
  }
}

// Write data
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// Generate RSS XML
function generateRSS(data) {
  const { feedInfo, items } = data;
  const buildDate = new Date().toUTCString();

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(feedInfo.title || 'VIB News Feed')}</title>
    <link>${escapeXml(feedInfo.link || 'http://localhost:3000')}</link>
    <description>${escapeXml(feedInfo.description || 'RSS Feed for testing')}</description>
    <language>${feedInfo.language || 'vi'}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <generator>VIB RSS Feed Generator</generator>
`;

  // Add items (sorted by date, newest first)
  const sortedItems = [...items].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  sortedItems.forEach(item => {
    rss += `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <guid isPermaLink="false">${item.guid}</guid>`;

    if (item.author) {
      rss += `
      <dc:creator>${escapeXml(item.author)}</dc:creator>`;
    }

    if (item.category) {
      rss += `
      <category>${escapeXml(item.category)}</category>`;
    }

    rss += `
    </item>`;
  });

  rss += `
  </channel>
</rss>`;

  return rss;
}

// Escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Routes

// Get all items
app.get('/api/items', (req, res) => {
  const data = readData();
  res.json(data.items);
});

// Add new item
app.post('/api/items', (req, res) => {
  const data = readData();
  const newItem = {
    id: Date.now().toString(),
    guid: `item-${Date.now()}`,
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    pubDate: req.body.pubDate || new Date().toISOString(),
    author: req.body.author || '',
    category: req.body.category || ''
  };

  data.items.unshift(newItem); // Add to beginning

  if (writeData(data)) {
    res.json({ success: true, item: newItem });
  } else {
    res.status(500).json({ success: false, error: 'Failed to save data' });
  }
});

// Delete item
app.delete('/api/items/:id', (req, res) => {
  const data = readData();
  const itemId = req.params.id;

  data.items = data.items.filter(item => item.id !== itemId);

  if (writeData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, error: 'Failed to delete item' });
  }
});

// Update feed info
app.put('/api/feed-info', (req, res) => {
  const data = readData();
  data.feedInfo = {
    ...data.feedInfo,
    ...req.body
  };

  if (writeData(data)) {
    res.json({ success: true, feedInfo: data.feedInfo });
  } else {
    res.status(500).json({ success: false, error: 'Failed to update feed info' });
  }
});

// Get feed info
app.get('/api/feed-info', (req, res) => {
  const data = readData();
  res.json(data.feedInfo);
});

// RSS Feed endpoint
app.get('/feed.xml', (req, res) => {
  const data = readData();
  const rss = generateRSS(data);

  res.set('Content-Type', 'application/rss+xml; charset=utf-8');
  res.send(rss);
});

// Initialize and start server
initDataFile();

app.listen(PORT, () => {
  console.log(`RSS Feed Generator running on http://localhost:${PORT}`);
  console.log(`RSS Feed available at: http://localhost:${PORT}/feed.xml`);
});
