// Serverless function for generating RSS feed

// Global data store (shared across requests in same function instance)
global.feedData = global.feedData || {
  feedInfo: {
    title: "VIB News Feed - Test",
    link: "",
    description: "RSS Feed for testing VIB sentiment analysis flow",
    language: "vi"
  },
  items: [
    {
      id: "1",
      guid: "example-item-1",
      title: "VIB ra mắt sản phẩm tín dụng mới hỗ trợ khách hàng",
      description: "Ngân hàng VIB vừa công bố gói sản phẩm tín dụng ưu đãi dành cho khách hàng cá nhân với lãi suất cạnh tranh, thủ tục đơn giản.",
      link: "https://example.com/vib-tin-dung-moi",
      pubDate: "2024-01-15T10:00:00.000Z",
      author: "Biên tập viên",
      category: "Tài chính ngân hàng"
    },
    {
      id: "2",
      guid: "example-item-2",
      title: "Lạm phát tăng cao ảnh hưởng đến ngành ngân hàng",
      description: "Chỉ số lạm phát tăng 4.5% trong quý này, tạo áp lực lên hoạt động cho vay của các ngân hàng thương mại.",
      link: "https://example.com/lam-phat-tang",
      pubDate: "2024-01-14T15:30:00.000Z",
      author: "Phóng viên kinh tế",
      category: "Kinh tế vĩ mô"
    }
  ]
};

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

// Generate RSS XML
function generateRSS(data, baseUrl) {
  const { feedInfo, items } = data;
  const buildDate = new Date().toUTCString();

  // Update link to current URL
  const feedLink = baseUrl || feedInfo.link;

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(feedInfo.title || 'VIB News Feed')}</title>
    <link>${escapeXml(feedLink)}</link>
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

module.exports = async (req, res) => {
  try {
    // Get base URL from request
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const data = global.feedData;
    const rss = generateRSS(data, baseUrl);

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).send(rss);

  } catch (error) {
    console.error('Error generating RSS:', error);
    return res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
};
