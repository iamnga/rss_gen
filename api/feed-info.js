// Serverless function for managing feed info

// Global data store (shared across requests in same function instance)
global.feedData = global.feedData || {
  feedInfo: {
    title: "VIB News Feed - Test",
    link: "",
    description: "RSS Feed for testing VIB sentiment analysis flow",
    language: "vi"
  },
  items: []
};

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
      return res.status(200).json(global.feedData.feedInfo);
    }

    // PUT - Update feed info
    if (req.method === 'PUT') {
      global.feedData.feedInfo = {
        ...global.feedData.feedInfo,
        ...req.body
      };
      return res.status(200).json({ success: true, feedInfo: global.feedData.feedInfo });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in feed-info API:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
