export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 使用公共代理或CORS代理服务
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://gpt.applecz.com/api/cdks/verify';
    
    const response = await fetch(proxyUrl + targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('代理请求失败:', error);
    return res.status(500).json({ 
      error: 'Proxy request failed',
      message: error.message
    });
  }
} 