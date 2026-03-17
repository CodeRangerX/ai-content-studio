// Vercel Serverless Function - API 代理
// API Key 存储在服务端，前端无法读取

// 服务端配置 - 不会暴露给前端
const API_CONFIG = {
  apiKey: 'sk-sp-51a41d94570b4e9593cf356a62f26089',
  baseUrl: 'https://coding.dashscope.aliyuncs.com',
  model: 'kimi-k2.5'
};

export default async function handler(req: any, res: any) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '请输入内容' });
    }

    // 调用后端 API
    const response = await fetch(`${API_CONFIG.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || '生成失败' });
    }

    return res.status(200).json({ 
      content: data.choices[0]?.message?.content || '无结果' 
    });

  } catch (error: any) {
    return res.status(500).json({ error: '服务暂时不可用，请稍后重试' });
  }
}