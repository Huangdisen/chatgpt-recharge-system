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
    console.log('收到请求:', { method: req.method, body: req.body });
    
    // 确保请求体存在
    if (!req.body) {
      return res.status(400).json({ error: 'Missing request body' });
    }
    
    // 简单直接的请求转发，使用与调试相同的方式
    const apiUrl = 'https://gpt.applecz.com/api/cdks/verify';
    
    console.log('发送请求到:', apiUrl);
    console.log('请求体:', JSON.stringify(req.body));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    
    console.log('API响应状态:', response.status);
    
    const responseText = await response.text();
    console.log('API响应内容:', responseText);
    
    // 总是返回200状态码，让前端处理业务逻辑
    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    
    try {
      const jsonData = JSON.parse(responseText);
      return res.json(jsonData);
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      return res.json({ error: 'Invalid JSON response', data: responseText });
    }
    
  } catch (error) {
    console.error('验证失败:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
} 