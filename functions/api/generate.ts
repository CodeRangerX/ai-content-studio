// Cloudflare Pages Function - 免费版本，直接调用 AI API
// 前端请求 /api/generate -> Cloudflare Function -> DeepSeek API

const API_CONFIG = {
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-reasoner',
};

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'BAD_REQUEST', 
        message: '请输入内容' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 从环境变量获取 API Key
    const apiKey = context.env?.DEEPSEEK_API_KEY || '';

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'CONFIG_ERROR', 
        message: 'API 配置错误' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();

    // 直接调用 DeepSeek API
    const response = await fetch(`${API_CONFIG.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    const generationTimeMs = Date.now() - startTime;

    if (data.error) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'AI_ERROR', 
        message: data.error.message || '生成失败' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const content = data.choices[0]?.message?.content || '无结果';

    return new Response(JSON.stringify({ 
      success: true,
      content,
      generationTimeMs
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    console.error('Generate error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'SERVICE_ERROR', 
      message: '服务暂时不可用: ' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}