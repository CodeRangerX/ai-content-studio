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
// PayPal 订阅路由
// ============================================

import {
  createSubscription,
  getSubscription,
  cancelSubscription,
  getUserSubscription,
  createSubscriptionRecord,
  updateSubscriptionStatus,
  hasProAccess,
  verifyWebhookSignature,
} from './services/paypal.js';

// 获取用户订阅状态
app.get('/api/subscription/status', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED', message: '未登录' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN', message: 'Token 无效' }, 401);
  }

  const subscription = getUserSubscription(payload.userId);
  const isPro = hasProAccess(payload.userId);

  return c.json({
    success: true,
    data: {
      isPro,
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
      } : null,
    },
  });
});

// 创建订阅
app.post('/api/subscription/create', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED', message: '未登录' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN', message: 'Token 无效' }, 401);
  }

  try {
    const body = await c.req.json();
    const { plan } = body; // 'pro_monthly' | 'pro_yearly'

    if (!['pro_monthly', 'pro_yearly'].includes(plan)) {
      return c.json({ success: false, error: 'INVALID_PLAN', message: '无效的订阅计划' }, 400);
    }

    const result = await createSubscription(payload.userId, plan);
    
    // 记录订阅
    createSubscriptionRecord(payload.userId, result.subscriptionId, plan);

    return c.json({
      success: true,
      data: {
        subscriptionId: result.subscriptionId,
        approvalUrl: result.approvalUrl,
      },
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '创建订阅失败' }, 500);
  }
});

// 取消订阅
app.post('/api/subscription/cancel', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'UNAUTHORIZED', message: '未登录' }, 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ success: false, error: 'INVALID_TOKEN', message: 'Token 无效' }, 401);
  }

  try {
    const subscription = getUserSubscription(payload.userId);
    
    if (!subscription || !subscription.paypal_subscription_id) {
      return c.json({ success: false, error: 'NO_SUBSCRIPTION', message: '没有活跃的订阅' }, 400);
    }

    await cancelSubscription(subscription.paypal_subscription_id);
    
    // 更新状态
    updateSubscriptionStatus(subscription.paypal_subscription_id, 'cancelled');

    return c.json({ success: true, message: '订阅已取消，当前周期结束后生效' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '取消订阅失败' }, 500);
  }
});

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

    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const subscriptionId = event.resource.id;
        const customId = event.resource.custom_id; // userId
        
        // 获取订阅详情
        const subDetails = await getSubscription(subscriptionId);
        
        updateSubscriptionStatus(
          subscriptionId, 
          'active',
          subDetails.billing_info?.next_billing_time
        );
        
        console.log(`✅ Subscription activated: ${subscriptionId} for user ${customId}`);
        break;
      }
      
      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        const subscriptionId = event.resource.id;
        updateSubscriptionStatus(subscriptionId, 'cancelled');
        console.log(`Subscription cancelled: ${subscriptionId}`);
        break;
      }
      
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subscriptionId = event.resource.id;
        updateSubscriptionStatus(subscriptionId, 'expired');
        console.log(`Subscription expired: ${subscriptionId}`);
        break;
      }
      
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        const subscriptionId = event.resource.id;
        updateSubscriptionStatus(subscriptionId, 'payment_failed');
        console.log(`Payment failed: ${subscriptionId}`);
        break;
      }
      
      case 'PAYMENT.SALE.COMPLETED': {
        // 记录支付成功
        console.log(`Payment completed: ${event.resource.id}`);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.event_type}`);
    }

    return c.json({ status: 'ok' });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return c.json({ status: 'error' }, 500);
  }
});

// ============================================
// 内容生成路由（需要权限验证）
// ============================================

// API 配置
const API_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY || 'sk-sp-51a41d94570b4e9593cf356a62f26089',
  baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://coding.dashscope.aliyuncs.com',
  model: process.env.DEEPSEEK_MODEL || 'kimi-k2.5'
};

// 免费用户每日限制
const FREE_DAILY_LIMIT = 3;

// 获取用户今日使用次数
function getTodayUsage(userId: string): number {
  const today = new Date().toISOString().split('T')[0];
  const result = queryOne<{ count: number }>(
    'SELECT count FROM usage_tracking WHERE user_id = ? AND date = ?',
    [userId, today]
  );
  return result?.count || 0;
}

// 增加使用次数
function incrementUsage(userId: string): void {
  const today = new Date().toISOString().split('T')[0];
  const existing = queryOne<{ id: number }>(
    'SELECT id FROM usage_tracking WHERE user_id = ? AND date = ?',
    [userId, today]
  );
  
  if (existing) {
    run(
      'UPDATE usage_tracking SET count = count + 1 WHERE user_id = ? AND date = ?',
      [userId, today]
    );
  } else {
    run(
      'INSERT INTO usage_tracking (user_id, date, count) VALUES (?, ?, 1)',
      [userId, today]
    );
  }
}

// 生成内容 API
app.post('/api/generate', async (c) => {
  // 验证用户登录
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ 
      success: false, 
      error: 'UNAUTHORIZED', 
      message: '请先登录' 
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
    const { prompt } = body;

    if (!prompt) {
      return c.json({ 
        success: false, 
        error: 'BAD_REQUEST', 
        message: '请输入内容' 
      }, 400);
    }

    // 检查用户权限
    const isPro = hasProAccess(payload.userId);
    
    if (!isPro) {
      // 免费用户检查使用次数
      const todayUsage = getTodayUsage(payload.userId);
      
      if (todayUsage >= FREE_DAILY_LIMIT) {
        return c.json({ 
          success: false, 
          error: 'LIMIT_EXCEEDED', 
          message: '今日免费使用次数已用完，请升级 Pro 解锁无限使用',
          data: {
            usage: todayUsage,
            limit: FREE_DAILY_LIMIT
          }
        }, 403);
      }
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

    // 免费用户增加使用次数
    if (!isPro) {
      incrementUsage(payload.userId);
    }

    return c.json({ 
      success: true,
      content: data.choices[0]?.message?.content || '无结果' 
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

// 获取用户使用情况
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

  const isPro = hasProAccess(payload.userId);
  const todayUsage = getTodayUsage(payload.userId);

  return c.json({
    success: true,
    data: {
      isPro,
      todayUsage,
      dailyLimit: isPro ? null : FREE_DAILY_LIMIT,
      remaining: isPro ? null : Math.max(0, FREE_DAILY_LIMIT - todayUsage)
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