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

// 验证并激活订阅（用户从 PayPal 返回后调用）
app.post('/api/subscription/verify', async (c) => {
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
      return c.json({ success: false, error: 'NO_SUBSCRIPTION', message: '没有订阅记录' }, 400);
    }

    // 从 PayPal 获取最新状态
    const paypalSub = await getSubscription(subscription.paypal_subscription_id);
    
    console.log('PayPal subscription status:', paypalSub.status);
    
    // 更新本地状态
    if (paypalSub.status === 'ACTIVE') {
      updateSubscriptionStatus(
        subscription.paypal_subscription_id, 
        'active',
        paypalSub.billing_info?.next_billing_time
      );
      
      return c.json({ 
        success: true, 
        message: '订阅已激活',
        data: {
          plan: subscription.plan,
          status: 'active',
          currentPeriodEnd: paypalSub.billing_info?.next_billing_time
        }
      });
    } else if (paypalSub.status === 'APPROVAL_PENDING') {
      return c.json({ 
        success: false, 
        error: 'PENDING', 
        message: '订阅等待批准中，请完成支付' 
      });
    } else {
      return c.json({ 
        success: false, 
        error: 'INACTIVE', 
        message: `订阅状态: ${paypalSub.status}` 
      });
    }
  } catch (error) {
    console.error('Verify subscription error:', error);
    return c.json({ success: false, error: 'SERVER_ERROR', message: '验证订阅失败' }, 500);
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

// 生成内容 API（免费版本，无需登录）
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
  const isPro = hasProAccess(payload.userId);

  return c.json({
    success: true,
    data: {
      balance: credits.balance,
      totalPurchased: credits.total_purchased,
      totalUsed: credits.total_used,
      isPro,
      canUse: isPro || credits.balance > 0
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
      summary,
      isPro: hasProAccess(payload.userId)
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

  const isPro = hasProAccess(payload.userId);
  const credits = getOrCreateUserCredits(payload.userId);
  const genStats = getUserGenerationStats(payload.userId, 30);
  const subscription = getUserSubscription(payload.userId);

  return c.json({
    success: true,
    data: {
      isPro,
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      } : null,
      credits: {
        balance: credits.balance,
        totalPurchased: credits.total_purchased,
        totalUsed: credits.total_used
      },
      generations: {
        totalThisMonth: genStats.total,
        byTemplate: genStats.byTemplate,
        creditsUsed: genStats.creditsUsed,
        subscriptionSaved: genStats.subscriptionSaved
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

  const isPro = hasProAccess(payload.userId);
  const credits = getOrCreateUserCredits(payload.userId);

  return c.json({
    success: true,
    data: {
      isPro,
      creditsBalance: credits.balance,
      canUse: isPro || credits.balance > 0
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