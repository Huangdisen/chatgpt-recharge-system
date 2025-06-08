export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: 'Vercel Serverless Function',
    tests: []
  };
  
  // 测试1: 基本网络连接
  try {
    const response = await fetch('https://httpbin.org/ip', { timeout: 5000 });
    const data = await response.json();
    testResults.tests.push({
      name: '基本网络连接',
      status: 'success',
      data: data
    });
  } catch (error) {
    testResults.tests.push({
      name: '基本网络连接',
      status: 'failed',
      error: error.message
    });
  }
  
  // 测试2: 目标API服务器连接
  try {
    const response = await fetch('https://gpt.applecz.com/api/cdks/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cdk_key: 'test' }),
      timeout: 10000
    });
    
    const data = await response.text();
    testResults.tests.push({
      name: '目标API连接',
      status: 'success',
      httpStatus: response.status,
      data: data
    });
  } catch (error) {
    testResults.tests.push({
      name: '目标API连接', 
      status: 'failed',
      error: error.message
    });
  }
  
  // 测试3: DNS解析
  try {
    const response = await fetch('https://dns.google/resolve?name=gpt.applecz.com&type=A');
    const data = await response.json();
    testResults.tests.push({
      name: 'DNS解析',
      status: 'success',
      data: data
    });
  } catch (error) {
    testResults.tests.push({
      name: 'DNS解析',
      status: 'failed', 
      error: error.message
    });
  }
  
  return res.status(200).json(testResults);
} 