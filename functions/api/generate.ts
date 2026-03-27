// Cloudflare Pages Function - 代理到 Railway 后端
// 前端请求 /api/generate -> Cloudflare Function -> Railway 后端

const RAILWAY_BACKEND = 'https://ai-content-studio-production-f3a4.up.railway.app';

export async function onRequestPost(context: any) {
  try {
    const body = await context.request.json();

    // 免费版本：不需要 Authorization
    const response = await fetch(`${RAILWAY_BACKEND}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
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