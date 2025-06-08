export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 转发请求到远程API
    const response = await fetch('https://gpt.applecz.com/api/cdks/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.text();
    
    // 设置响应状态码并返回数据
    res.status(response.status);
    
    try {
      // 尝试解析为JSON
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      // 如果不是JSON，直接返回文本
      res.send(data);
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Network request failed', 
      message: error.message 
    });
  }
} 