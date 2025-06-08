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
    
    // 转发请求到远程API
    const apiResponse = await fetch('https://gpt.applecz.com/api/cdks/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CDK-Verify-Service/1.0'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 获取响应数据
    const responseText = await apiResponse.text();
    
    // 设置相同的响应状态码
    res.status(apiResponse.status);
    
    // 尝试解析JSON
    try {
      const jsonData = JSON.parse(responseText);
      return res.json(jsonData);
    } catch {
      // 如果不是JSON，返回原始文本
      return res.send(responseText);
    }
    
  } catch (error) {
    console.error('CDK验证错误:', error);
    return res.status(500).json({ 
      error: 'CDK验证失败',
      message: 'Network request failed'
    });
  }
} 