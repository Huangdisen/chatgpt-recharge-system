export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 先返回一个测试响应，看看前端能否接收到
  if (req.query.test === 'ping') {
    return res.status(200).json({
      message: 'API函数工作正常',
      timestamp: new Date().toISOString(),
      receivedBody: req.body
    });
  }
  
  // 如果没有测试参数，尝试实际的API调用
  try {
    const response = await fetch('https://gpt.applecz.com/api/cdks/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || { cdk_key: 'test' })
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