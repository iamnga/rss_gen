// Serverless function for managing news items
const { getItems, addItem, deleteItem } = require('./data-store');

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
      const items = getItems();
      return res.status(200).json(items);
    }

    // POST - Add new item
    if (req.method === 'POST') {
      const newItem = {
        title: req.body.title,
        description: req.body.description,
        link: req.body.link,
        pubDate: req.body.pubDate || new Date().toISOString(),
        author: req.body.author || '',
        category: req.body.category || ''
      };

      const item = addItem(newItem);
      return res.status(200).json({ success: true, item });
    }

    // DELETE - Delete item by ID (from query or body)
    if (req.method === 'DELETE') {
      // Try to get ID from query first, then from path
      const id = req.query.id || req.body?.id;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Item ID is required' });
      }

      const deleted = deleteItem(id);
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
