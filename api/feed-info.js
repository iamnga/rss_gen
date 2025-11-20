// Serverless function for managing feed info
const { getFeedInfo, updateFeedInfo } = require('./data-store');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // GET - Get feed info
    if (req.method === 'GET') {
      const feedInfo = getFeedInfo();
      return res.status(200).json(feedInfo);
    }

    // PUT - Update feed info
    if (req.method === 'PUT') {
      const updatedInfo = updateFeedInfo(req.body);
      return res.status(200).json({ success: true, feedInfo: updatedInfo });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in feed-info API:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
