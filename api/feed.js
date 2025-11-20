// Serverless function for generating RSS feed
const { getData } = require('./data-store');

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

    const data = getData();
    const rss = generateRSS(data, baseUrl);

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).send(rss);

  } catch (error) {
    console.error('Error generating RSS:', error);
    return res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
};
