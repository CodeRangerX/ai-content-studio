import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 导入数据库初始化
import { initDatabase, queryOne, run } from './db/index.js';

// 导入服务
import {
  sendVerificationCode,
  register,
  login,
  resetPassword,
  googleLogin,
  verifyAccessToken,
} from './services/auth.js';

// 创建应用
const app = new Hono();

// 中间件
app.use('*', logger());
app.use('*', cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://pro.ai-content-studio-am5.pages.dev',
    'https://main.ai-content-studio-am5.pages.dev',
    'https://content-studio-ai.shop',
    'https://pro.content-studio-ai.shop',
  ],
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
// 认证路由
// ============================================

// 发送验证码
app.post('/api/auth/send-code', async (c) => {
  try {
    const body = await c.req.json();
    const { email, type } = body;

    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'INVALID_EMAIL', message: '请输入有效的邮箱地址' }, 400);
    }

    if (!['register', 'reset_password'].includes(type)) {
      return c.json({ success: false, error: 'INVALID_TYPE', message: '无效的验证码类型' }, 400);
    }

    const result = await sendVerificationCode(email, type);

    if (!result.success) {
      return c.json({ success: false, error: 'SEND_FAILED', message: result.error }, 400);
    }

    // 开发环境返回验证码
    const devInfo = result.code ? { devCode: result.code } : {};
    return c.json({ success: true, message: '验证码已发送', ...devInfo });
  } catch (error) {
    console.error('Send code error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '服务器错误' }, 500);
  }
});

// 注册
app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, code } = body;

    // 基本验证
    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'INVALID_EMAIL', message: '请输入有效的邮箱地址' }, 400);
    }
    if (!password || password.length < 8) {
      return c.json({ success: false, error: 'INVALID_PASSWORD', message: '密码至少8位' }, 400);
    }
    if (!code || code.length !== 6) {
      return c.json({ success: false, error: 'INVALID_CODE', message: '请输入6位验证码' }, 400);
    }

    const result = await register({ email, password, code });

    if (!result.success) {
      return c.json({ success: false, error: 'REGISTER_FAILED', message: result.error }, 400);
    }

    return c.json({
      success: true,
      data: {
        user: result.user,
        token: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: 7200,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '服务器错误' }, 500);
  }
});

// 登录
app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, rememberMe } = body;

    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'INVALID_EMAIL', message: '请输入有效的邮箱地址' }, 400);
    }
    if (!password) {
      return c.json({ success: false, error: 'INVALID_PASSWORD', message: '请输入密码' }, 400);
    }

    const result = await login({ email, password, rememberMe });

    if (!result.success) {
      return c.json({ success: false, error: 'LOGIN_FAILED', message: result.error }, 401);
    }

    return c.json({
      success: true,
      data: {
        user: result.user,
        token: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: rememberMe ? 2592000 : 604800, // 30天或7天
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '服务器错误' }, 500);
  }
});

// 重置密码
app.post('/api/auth/reset-password', async (c) => {
  try {
    const body = await c.req.json();
    const { email, code, newPassword } = body;

    if (!email || !email.includes('@')) {
      return c.json({ success: false, error: 'INVALID_EMAIL', message: '请输入有效的邮箱地址' }, 400);
    }
    if (!newPassword || newPassword.length < 8) {
      return c.json({ success: false, error: 'INVALID_PASSWORD', message: '密码至少8位' }, 400);
    }
    if (!code || code.length !== 6) {
      return c.json({ success: false, error: 'INVALID_CODE', message: '请输入6位验证码' }, 400);
    }

    const result = await resetPassword(email, code, newPassword);

    if (!result.success) {
      return c.json({ success: false, error: 'RESET_FAILED', message: result.error }, 400);
    }

    return c.json({ success: true, message: '密码重置成功' });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '服务器错误' }, 500);
  }
});

// Google 登录
app.post('/api/auth/google', async (c) => {
  try {
    const body = await c.req.json();
    const { credential } = body;

    if (!credential) {
      return c.json({ success: false, error: 'MISSING_CREDENTIAL', message: '缺少登录凭证' }, 400);
    }

    const result = await googleLogin(credential);

    if (!result.success) {
      return c.json({ success: false, error: 'GOOGLE_AUTH_FAILED', message: result.error }, 401);
    }

    return c.json({
      success: true,
      data: {
        user: result.user,
        token: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          expiresIn: 2592000, // 30天
        },
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '服务器错误' }, 500);
  }
});

// 获取当前用户
app.get('/api/auth/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED', message: '未登录' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN', message: 'Token 无效或已过期' }, 401);
  }

  return c.json({
    success: true,
    data: {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    },
  });
});

// 登出（客户端清除 token 即可）
app.post('/api/auth/logout', (c) => {
  return c.json({ success: true, message: '已登出' });
});

// ============================================
// PayPal Webhook（用于点数购买确认）
// ============================================

import { verifyWebhookSignature } from './services/paypal.js';

// PayPal Webhook
app.post('/api/webhook/paypal', async (c) => {
  try {
    // 获取 headers（需要小写）
    const headers: Record<string, string> = {};
    c.req.raw.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    
    // 获取 raw body
    const body = await c.req.text();
    
    // 验证签名
    const verification = await verifyWebhookSignature(headers, body);
    
    if (!verification.valid) {
      console.error('Webhook verification failed:', verification.error);
      return c.json({ status: 'error', error: verification.error }, 401);
    }
    
    const event = verification.event;
    console.log('PayPal Webhook Event:', event.event_type);

    // 目前点数购买使用 Orders API，不需要 webhook 处理
    // 未来如需要可在这里处理 CHECKOUT.ORDER.APPROVED 等事件

    return c.json({ status: 'ok' });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return c.json({ status: 'error' }, 500);
  }
});

// ============================================
// 内容生成路由（需要权限验证）
// ============================================

// 导入点数相关模块
import {
  CREDIT_PACKAGES,
  CreditPackageId,
  getOrCreateUserCredits,
  hasEnoughCredits,
  deductCredits,
  createPurchase,
  getPurchaseById,
  completePurchase,
  getUserPurchases,
  getTransactions,
  getTransactionSummary,
  createGeneration,
  updateGenerationResult,
  markGenerationFailed,
  getUserGenerations,
  getUserGenerationStats,
} from './db/credits.js';

// API 配置
const API_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-sp-51a41d94570b4e9593cf356a62f26089',
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://coding.dashscope.aliyuncs.com',
  model: process.env.DEEPSEEK_MODEL || 'kimi-k2.5'
};

// 每次生成消耗的点数
const CREDITS_PER_GENERATION = 1;

// 免费版本生成 API（不需要登录）
app.post('/api/generate/free', async (c) => {
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

    // 调用 AI API
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
      return c.json({ 
        success: false, 
        error: 'AI_ERROR', 
        message: data.error.message || '生成失败'
      }, 500);
    }

    const content = data.choices[0]?.message?.content || '无结果';

    return c.json({ 
      success: true,
      content
    });

  } catch (error: any) {
    console.error('Free generate error:', error);
    return c.json({ 
      success: false, 
      error: 'SERVER_ERROR', 
      message: '服务暂时不可用，请稍后重试' 
    }, 500);
  }
});

// 生成内容 API（pro版本，需要登录并扣减点数）
app.post('/api/generate', async (c) => {
  // 验证登录
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ 
      success: false, 
      error: 'UNAUTHORIZED', 
      message: '请先登录后再生成内容' 
    }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ 
      success: false, 
      error: 'INVALID_TOKEN', 
      message: '登录已过期，请重新登录' 
    }, 401);
  }

  try {
    const body = await c.req.json();
    const { prompt, templateId, templateName, inputData } = body;

    if (!prompt) {
      return c.json({ 
        success: false, 
        error: 'BAD_REQUEST', 
        message: '请输入内容' 
      }, 400);
    }

    // 检查点数余额
    const credits = getOrCreateUserCredits(payload.userId);
    if (credits.balance < CREDITS_PER_GENERATION) {
      return c.json({ 
        success: false, 
        error: 'INSUFFICIENT_CREDITS', 
        message: `点数不足，当前余额 ${credits.balance} 点，需要 ${CREDITS_PER_GENERATION} 点`,
        balance: credits.balance
      }, 402);
    }

    // 创建生成记录（初始状态为 pending）
    const generation = createGeneration(
      payload.userId,
      templateId || 'custom',
      templateName || '自定义生成',
      inputData || { prompt }
    );

    const startTime = Date.now();

    // 调用 AI API
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
      // 标记生成失败
      markGenerationFailed(generation.id, data.error.message || '生成失败');
      return c.json({ 
        success: false, 
        error: 'AI_ERROR', 
        message: data.error.message || '生成失败',
        generationId: generation.id
      }, 500);
    }

    const content = data.choices[0]?.message?.content || '无结果';
    const tokensInput = data.usage?.prompt_tokens || 0;
    const tokensOutput = data.usage?.completion_tokens || 0;

    // 扣减点数
    const deductResult = deductCredits(
      payload.userId,
      CREDITS_PER_GENERATION,
      `生成内容: ${templateName || '自定义'}`,
      generation.id
    );

    // 更新生成记录
    updateGenerationResult(
      generation.id,
      content,
      CREDITS_PER_GENERATION,
      tokensInput,
      tokensOutput,
      generationTimeMs
    );

    return c.json({ 
      success: true,
      content,
      generationId: generation.id,
      creditsUsed: CREDITS_PER_GENERATION,
      remainingBalance: deductResult.balance
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
// 点数相关 API
// ============================================

// 获取点数余额
app.get('/api/credits/balance', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const credits = getOrCreateUserCredits(payload.userId);

  return c.json({
    success: true,
    data: {
      balance: credits.balance,
      totalPurchased: credits.total_purchased,
      totalUsed: credits.total_used,
      canUse: credits.balance > 0
    }
  });
});

// 获取可用点数包
app.get('/api/credits/packages', (c) => {
  return c.json({
    success: true,
    data: CREDIT_PACKAGES
  });
});

// 创建点数购买订单
app.post('/api/credits/purchase', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED', message: '请先登录' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN', message: '登录已过期' }, 401);
  }

  try {
    const body = await c.req.json();
    const { packageId } = body;

    if (!packageId || !CREDIT_PACKAGES[packageId as CreditPackageId]) {
      return c.json({ success: false, error: 'INVALID_PACKAGE', message: '无效的点数包' }, 400);
    }

    const pkg = CREDIT_PACKAGES[packageId as CreditPackageId];

    // 创建 PayPal 订单
    const paypalResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `credits_${payload.userId}_${Date.now()}`,
          description: `AI Content Studio - ${pkg.name.zh} (${pkg.points} 点)`,
          amount: {
            currency_code: 'USD',
            value: (pkg.price / 100).toFixed(2),
          },
          custom_id: payload.userId,
        }],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/credits/success`,
          cancel_url: `${process.env.FRONTEND_URL}/credits/cancel`,
        }
      }),
    });

    const paypalData = await paypalResponse.json();

    if (paypalData.error) {
      console.error('PayPal error:', paypalData.error);
      return c.json({ success: false, error: 'PAYPAL_ERROR', message: '创建支付订单失败' }, 500);
    }

    // 创建购买记录
    const purchase = createPurchase(
      payload.userId,
      packageId as CreditPackageId,
      paypalData.id
    );

    // 获取批准链接
    const approvalUrl = paypalData.links?.find((l: any) => l.rel === 'approve')?.href;

    return c.json({
      success: true,
      data: {
        orderId: paypalData.id,
        purchaseId: purchase.id,
        approvalUrl,
        package: pkg
      }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '创建订单失败' }, 500);
  }
});

// 确认点数购买（支付成功后调用）
app.post('/api/credits/purchase/:orderId/capture', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const orderId = c.req.param('orderId');

  try {
    // 捕获 PayPal 支付
    const captureResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    const captureData = await captureResponse.json();

    if (captureData.error || captureData.status === 'UNPROCESSABLE_ENTITY') {
      console.error('Capture error:', captureData);
      return c.json({ success: false, error: 'CAPTURE_FAILED', message: '支付确认失败' }, 500);
    }

    // 查找对应的购买记录
    const purchases = getUserPurchases(payload.userId);
    const purchase = purchases.find(p => p.paypal_order_id === orderId);

    if (!purchase) {
      return c.json({ success: false, error: 'PURCHASE_NOT_FOUND', message: '找不到购买记录' }, 404);
    }

    // 完成购买，增加点数
    const result = completePurchase(purchase.id);

    return c.json({
      success: true,
      data: {
        newBalance: result.newBalance,
        points: CREDIT_PACKAGES[purchase.package_id as CreditPackageId].points
      }
    });

  } catch (error) {
    console.error('Capture error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '支付确认失败' }, 500);
  }
});

// 获取点数交易历史
app.get('/api/credits/history', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  const transactions = getTransactions(payload.userId, limit, offset);
  const summary = getTransactionSummary(payload.userId);

  return c.json({
    success: true,
    data: {
      transactions,
      summary
    }
  });
});

// 获取购买记录（账单）
app.get('/api/credits/purchases', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const purchases = getUserPurchases(payload.userId, 100);

  return c.json({
    success: true,
    data: purchases
  });
});

// ============================================
// 生成历史 API
// ============================================

// 获取生成历史
app.get('/api/generations', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  const generations = getUserGenerations(payload.userId, limit, offset);

  return c.json({
    success: true,
    data: generations
  });
});

// 获取单条生成详情
app.get('/api/generations/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const genId = c.req.param('id');
  const generation = getUserGenerations(payload.userId, 1000).find(g => g.id === genId);

  if (!generation) {
    return c.json({ success: false, error: 'NOT_FOUND', message: '找不到该记录' }, 404);
  }

  return c.json({
    success: true,
    data: generation
  });
});

// 获取用户统计
app.get('/api/stats', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const credits = getOrCreateUserCredits(payload.userId);
  const genStats = getUserGenerationStats(payload.userId, 30);

  return c.json({
    success: true,
    data: {
      credits: {
        balance: credits.balance,
        totalPurchased: credits.total_purchased,
        totalUsed: credits.total_used
      },
      generations: {
        totalThisMonth: genStats.total,
        byTemplate: genStats.byTemplate,
        creditsUsed: genStats.creditsUsed
      }
    }
  });
});

// 旧版使用情况 API（兼容）
app.get('/api/usage', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN' }, 401);
  }

  const credits = getOrCreateUserCredits(payload.userId);

  return c.json({
    success: true,
    data: {
      creditsBalance: credits.balance,
      canUse: credits.balance > 0
    }
  });
});

// ============================================
// 启动服务器
// ============================================
const PORT = parseInt(process.env.PORT || '3001');

// 初始化数据库后启动服务
async function start() {
  await initDatabase();
  
  serve({
    fetch: app.fetch,
    port: PORT,
  });

  console.log(`🚀 Server running on http://localhost:${PORT}`);
}

start();