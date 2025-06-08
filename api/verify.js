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
    console.log('收到请求:', req.body);
    
    // 转发请求到远程API
    const response = await fetch('https://gpt.applecz.com/api/cdks/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });
    
    console.log('远程API响应状态:', response.status);
    
    const data = await response.text();
    console.log('远程API响应数据:', data);
    
    // 设置响应状态码
    res.status(response.status);
    
    try {
      // 尝试解析为JSON
      const jsonData = JSON.parse(data);
      return res.json(jsonData);
    } catch (parseError) {
      console.log('JSON解析失败，返回原始文本');
      return res.send(data);
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Network request failed', 
      message: error.message 
    });
  }
} 