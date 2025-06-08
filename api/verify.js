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
    // 获取请求数据
    const requestBody = req.body;
    
    // 使用简化的fetch请求
    const response = await fetch('https://gpt.applecz.com/api/cdks/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('验证错误:', error);
    return res.status(500).json({ 
      error: 'Network request failed',
      message: error.message
    });
  }
} 