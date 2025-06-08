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
    console.log('收到CDK验证请求:', req.body);
    
    // 获取请求数据
    const requestBody = req.body;
    
    if (!requestBody || !requestBody.cdk_key) {
      return res.status(400).json({ 
        error: 'CDK key is required',
        received: requestBody 
      });
    }
    
    console.log('准备转发到远程API...');
    
    // 转发请求到远程API
    const apiResponse = await fetch('https://gpt.applecz.com/api/cdks/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; CDK-Verify/1.0)'
      },
      body: JSON.stringify(requestBody),
      timeout: 10000
    });
    
    console.log('远程API响应状态:', apiResponse.status);
    
    // 获取响应数据
    const responseText = await apiResponse.text();
    console.log('远程API响应内容:', responseText);
    
    // 设置相同的响应状态码
    res.status(apiResponse.status);
    
    // 尝试解析JSON
    try {
      const jsonData = JSON.parse(responseText);
      return res.json(jsonData);
    } catch (parseError) {
      console.log('JSON解析失败:', parseError);
      return res.send(responseText);
    }
    
  } catch (error) {
    console.error('CDK验证错误详情:', error.message);
    return res.status(500).json({ 
      error: 'CDK验证失败',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 