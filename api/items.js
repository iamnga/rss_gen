// Serverless function for managing news items
// Data stored in memory (will reset on cold start)

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

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // GET - Get all items
    if (req.method === 'GET') {
      const items = global.feedData.items;
      return res.status(200).json(items);
    }

    // POST - Add new item
    if (req.method === 'POST') {
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

      global.feedData.items.unshift(newItem);
      return res.status(200).json({ success: true, item: newItem });
    }

    // DELETE - Delete item by ID (from query or body)
    if (req.method === 'DELETE') {
      const id = req.query.id || req.body?.id;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Item ID is required' });
      }

      const initialLength = global.feedData.items.length;
      global.feedData.items = global.feedData.items.filter(item => item.id !== id);
      const deleted = global.feedData.items.length < initialLength;

      if (deleted) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ success: false, error: 'Item not found' });
      }
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in items API:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
