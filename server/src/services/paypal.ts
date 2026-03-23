import { query, queryOne, run } from '../db/index.js';
import crypto from 'crypto';

// PayPal API 配置
const PAYPAL_API = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

// 计划 ID（PayPal Sandbox）
const PLAN_IDS: Record<string, string> = {
  'pro_monthly': process.env.PAYPAL_PLAN_MONTHLY || 'P-2RU54035EM8580038NG6BE7A',
  'pro_yearly': process.env.PAYPAL_PLAN_YEARLY || 'P-0CS67175ND420383TNG6BE7I',
};

// 缓存 access token
let cachedToken: { token: string; expiresAt: number } | null = null;

// 获取 PayPal Access Token
async function getAccessToken(): Promise<string> {
  // 检查缓存
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 提前1分钟过期
  };

  return data.access_token;
}

// 创建订阅计划（只需执行一次）
export async function createPlan(plan: 'monthly' | 'yearly'): Promise<string> {
  const token = await getAccessToken();
  
  const planData = plan === 'monthly' ? {
    name: 'Pro Monthly',
    description: 'Content Studio Pro - Monthly Subscription',
    type: 'SERVICE',
    category: 'SOFTWARE',
    billing_cycles: [{
      frequency: { interval_unit: 'MONTH', interval_count: 1 },
      tenure_type: 'REGULAR',
      sequence: 1,
      total_cycles: 0,
      pricing_scheme: { fixed_price: { value: '9.00', currency_code: 'USD' } }
    }],
  } : {
    name: 'Pro Yearly',
    description: 'Content Studio Pro - Yearly Subscription',
    type: 'SERVICE',
    category: 'SOFTWARE',
    billing_cycles: [{
      frequency: { interval_unit: 'YEAR', interval_count: 1 },
      tenure_type: 'REGULAR',
      sequence: 1,
      total_cycles: 0,
      pricing_scheme: { fixed_price: { value: '79.00', currency_code: 'USD' } }
    }],
  };

  const response = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      ...planData,
      product_id: process.env.PAYPAL_PRODUCT_ID 
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create plan: ${error}`);
  }

  const data = await response.json();
  return data.id;
}

// 创建订阅
export async function createSubscription(
  userId: string, 
  plan: 'pro_monthly' | 'pro_yearly'
): Promise<{ subscriptionId: string; approvalUrl: string }> {
  const token = await getAccessToken();
  const planId = PLAN_IDS[plan];

  if (!planId) {
    throw new Error(`Plan ID not configured for ${plan}`);
  }

  const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `sub-${userId}-${Date.now()}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: {
        custom_id: userId,
      },
      application_context: {
        brand_name: 'Content Studio',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        },
        return_url: `${process.env.FRONTEND_URL}?subscription=success`,
        cancel_url: `${process.env.FRONTEND_URL}?subscription=cancel`,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create subscription: ${error}`);
  }

  const data = await response.json();
  
  // 找到 approval URL
  const approvalUrl = data.links.find((l: any) => l.rel === 'approve')?.href;

  return {
    subscriptionId: data.id,
    approvalUrl,
  };
}

// 获取订阅详情
export async function getSubscription(subscriptionId: string): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get subscription');
  }

  return response.json();
}

// 取消订阅
export async function cancelSubscription(
  subscriptionId: string, 
  reason: string = 'User requested'
): Promise<void> {
  const token = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to cancel subscription');
  }
}

// ========== Webhook 签名验证 ==========

// 缓存 PayPal 证书
const certCache: Map<string, { cert: string; expiresAt: number }> = new Map();

// 获取 PayPal 证书
async function getPayPalCert(certUrl: string): Promise<string> {
  // 检查缓存
  const cached = certCache.get(certUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.cert;
  }

  const response = await fetch(certUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PayPal cert from ${certUrl}`);
  }

  const cert = await response.text();
  
  // 缓存 24 小时
  certCache.set(certUrl, {
    cert,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  return cert;
}

// 验证 Webhook 签名
export async function verifyWebhookSignature(
  headers: Record<string, string>,
  body: string
): Promise<{ valid: boolean; event?: any; error?: string }> {
  try {
    const transmissionId = headers['paypal-transmission-id'];
    const transmissionTime = headers['paypal-transmission-time'];
    const certUrl = headers['paypal-cert-url'];
    const authAlgo = headers['paypal-auth-algo'] || 'SHA256withRSA';
    const transmissionSig = headers['paypal-transmission-sig'];
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    // 检查必要字段
    if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig) {
      return { valid: false, error: 'Missing required PayPal headers' };
    }

    // 验证证书 URL 来自 PayPal
    if (!certUrl.startsWith('https://api-m.paypal.com/') && 
        !certUrl.startsWith('https://api-m.sandbox.paypal.com/')) {
      return { valid: false, error: 'Invalid certificate URL' };
    }

    // 解析 body 获取 webhook event
    const event = JSON.parse(body);

    // 如果配置了 webhook ID，验证是否匹配
    if (webhookId) {
      // 构建预期签名内容
      const expectedSig = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto.createHash('sha256').update(body).digest('hex')}`;
      
      // 获取证书
      const cert = await getPayPalCert(certUrl);
      
      // 验证签名
      const verifier = crypto.createVerify('RSA-SHA256');
      verifier.update(expectedSig);
      
      // 从证书提取公钥
      const certMatch = cert.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/);
      if (!certMatch) {
        return { valid: false, error: 'Invalid certificate format' };
      }

      const valid = verifier.verify(certMatch[0], transmissionSig, 'base64');
      
      if (!valid) {
        console.error('PayPal webhook signature verification failed');
        return { valid: false, error: 'Signature verification failed' };
      }
    }

    return { valid: true, event };
  } catch (error) {
    console.error('Webhook verification error:', error);
    return { valid: false, error: 'Verification error' };
  }
}

// ========== 数据库操作 ==========

// 获取用户订阅
export function getUserSubscription(userId: string): {
  id: string;
  user_id: string;
  paypal_subscription_id: string | null;
  status: string;
  plan: string;
  current_period_end: string | null;
} | null {
  return queryOne(`
    SELECT * FROM subscriptions 
    WHERE user_id = ? AND status = 'active'
    ORDER BY created_at DESC LIMIT 1
  `, [userId]);
}

// 创建订阅记录
export function createSubscriptionRecord(
  userId: string,
  paypalSubscriptionId: string,
  plan: string
): string {
  const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  run(`
    INSERT INTO subscriptions (id, user_id, paypal_subscription_id, plan, status)
    VALUES (?, ?, ?, ?, 'pending')
  `, [id, userId, paypalSubscriptionId, plan]);

  return id;
}

// 更新订阅状态
export function updateSubscriptionStatus(
  paypalSubscriptionId: string,
  status: string,
  periodEnd?: string
): void {
  run(`
    UPDATE subscriptions 
    SET status = ?, 
        current_period_end = ?,
        updated_at = datetime('now')
    WHERE paypal_subscription_id = ?
  `, [status, periodEnd || null, paypalSubscriptionId]);
}

// 检查用户是否有 Pro 权限
export function hasProAccess(userId: string): boolean {
  const sub = getUserSubscription(userId);
  if (!sub) return false;
  
  if (sub.status === 'active') return true;
  if (sub.status === 'cancelled' && sub.current_period_end) {
    return new Date(sub.current_period_end) > new Date();
  }
  
  return false;
}

export default {
  createPlan,
  createSubscription,
  getSubscription,
  cancelSubscription,
  getUserSubscription,
  createSubscriptionRecord,
  updateSubscriptionStatus,
  hasProAccess,
  verifyWebhookSignature,
};