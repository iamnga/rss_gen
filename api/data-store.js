// In-memory data store for Vercel serverless functions
// Data will reset on each deployment (suitable for testing purposes)

let feedData = {
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

// Get all data
function getData() {
  return feedData;
}

// Get items
function getItems() {
  return feedData.items;
}

// Add item
function addItem(item) {
  const newItem = {
    id: Date.now().toString(),
    guid: `item-${Date.now()}`,
    ...item
  };
  feedData.items.unshift(newItem);
  return newItem;
}

// Delete item
function deleteItem(id) {
  const initialLength = feedData.items.length;
  feedData.items = feedData.items.filter(item => item.id !== id);
  return feedData.items.length < initialLength;
}

// Get feed info
function getFeedInfo() {
  return feedData.feedInfo;
}

// Update feed info
function updateFeedInfo(info) {
  feedData.feedInfo = {
    ...feedData.feedInfo,
    ...info
  };
  return feedData.feedInfo;
}

module.exports = {
  getData,
  getItems,
  addItem,
  deleteItem,
  getFeedInfo,
  updateFeedInfo
};
