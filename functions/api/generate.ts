// Cloudflare Pages Function - API 代理
// API Key 存储在服务端，前端无法读取

const API_CONFIG = {
  apiKey: 'sk-49789365eeb84eccaabead081e6791dd',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-reasoner'
};

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: '请输入内容' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Sending request to API with prompt:', prompt.substring(0, 100));

    // 调用后端 API
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
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
      redirect: 'follow',
    });

    const responseText = await response.text();
    console.log('API Status:', response.status);
    console.log('API Raw Response:', responseText.substring(0, 1000));
    
    if (!responseText) {
      return new Response(JSON.stringify({ 
        error: 'API 返回空响应',
        status: response.status 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: 'API 返回非 JSON: ' + responseText.substring(0, 200) 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.error) {
      // 返回完整错误信息用于调试
      return new Response(JSON.stringify({ 
        error: data.error.message || JSON.stringify(data.error),
        fullError: data.error 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!data.choices || !data.choices[0]) {
      return new Response(JSON.stringify({ error: 'API 返回格式异常', data }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // DeepSeek reasoner 模型返回 reasoning_content
    const message = data.choices[0].message;
    const content = message?.content || message?.reasoning_content || '无结果';

    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: '服务异常: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}