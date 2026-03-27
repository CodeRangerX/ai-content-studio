import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 创建应用
const app = new Hono();

// API 配置
const API_CONFIG = {
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  model: process.env.DEEPSEEK_MODEL || 'deepseek-reasoner',
};

// 中间件
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ============================================
// 健康检查
// ============================================
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// 生成 API - 免费版本，无需登录
// ============================================
app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { prompt } = body;

    if (!prompt) {
      return c.json({ 
        success: false, 
        error: 'BAD_REQUEST', 
        message: '请输入内容' 
      }, 400);
    }

    const startTime = Date.now();

    // 调用 DeepSeek API
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
    const generationTimeMs = Date.now() - startTime;

    if (data.error) {
      return c.json({ 
        success: false, 
        error: 'AI_ERROR', 
        message: data.error.message || '生成失败' 
      }, 500);
    }

    const content = data.choices[0]?.message?.content || '无结果';

    return c.json({ 
      success: true,
      content,
      generationTimeMs
    });

  } catch (error: any) {
    console.error('Generate error:', error);
    return c.json({ 
      success: false, 
      error: 'SERVER_ERROR', 
      message: '服务暂时不可用，请稍后重试' 
    }, 500);
  }
});

// ============================================
// 启动服务器
// ============================================
const PORT = parseInt(process.env.PORT || '3001');

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`🚀 Free Server running on http://localhost:${PORT}`);