export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 测试模式
  if (req.query.test === 'ping') {
    return res.status(200).json({
      message: '充值API函数工作正常',
      timestamp: new Date().toISOString(),
      receivedBody: req.body
    });
  }
  
  // 实际充值请求
  try {
    const response = await fetch('https://gpt.applecz.com/recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    
    const text = await response.text();
    
    return res.status(200).json({
      success: true,
      apiStatus: response.status,
      apiResponse: text,
      receivedBody: req.body
    });
    
  } catch (error) {
    return res.status(200).json({
      success: false,
      error: error.message,
      receivedBody: req.body
    });
  }
} 