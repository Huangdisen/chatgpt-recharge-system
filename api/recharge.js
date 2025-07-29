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
    // 确保请求体存在
    if (!req.body) {
      return res.status(400).json({ error: 'Missing request body' });
    }
    
    // 简单直接的请求转发
    const apiUrl = 'https://api.gptpluscz.com/recharge';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CDK-Recharge-Service/1.0',
        'Accept': '*/*'
      },
      body: JSON.stringify(req.body)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误响应:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'API request failed',
        status: response.status,
        message: errorText
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('充值失败:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
} 