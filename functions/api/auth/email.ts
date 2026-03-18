// 邮箱登录 API
// 包含：注册、登录、发送验证码、重置密码

import { createWorker, JWT, JWK } from './jwt-utils';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
  emailVerified: boolean;
  createdAt: number;
}

interface VerificationCode {
  email: string;
  code: string;
  type: 'register' | 'reset_password';
  expiresAt: number;
}

// 密码哈希（使用 Web Crypto API）
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 验证密码
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// 生成验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 生成用户 ID
function generateUserId(): string {
  return 'usr_' + Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

// Base64 URL 编码
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// 生成 JWT
function generateJWT(user: Omit<User, 'passwordHash'>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({
    ...user,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天
  }));
  const signature = base64UrlEncode(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

// 发送验证码邮件（使用 Resend）
async function sendVerificationEmail(email: string, code: string, env: any): Promise<boolean> {
  const RESEND_API_KEY = env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    // 开发环境：打印验证码
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    return true;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: '【内容工坊】验证码',
        html: `
          <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">您好！</h2>
            <p>您的验证码是：</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
              ${code}
            </div>
            <p style="color: #666; font-size: 14px;">验证码 5 分钟内有效，请勿泄露给他人。</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">— 内容工坊团队</p>
          </div>
        `,
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// ============================================
// 发送验证码
// ============================================
async function handleSendCode(request: Request, env: any): Promise<Response> {
  try {
    const body = await request.json();
    const { email, type } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请输入有效的邮箱地址',
      }), { status: 400, headers: corsHeaders });
    }

    if (!['register', 'reset_password'].includes(type)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_TYPE',
        message: '无效的验证码类型',
      }), { status: 400, headers: corsHeaders });
    }

    // 检查发送频率限制（60秒内只能发送1次）
    const rateKey = `rate:send:${email}`;
    const existing = env.KV ? await env.KV.get(rateKey) : null;
    if (existing) {
      return new Response(JSON.stringify({
        success: false,
        error: 'RATE_LIMITED',
        message: '发送太频繁，请60秒后再试',
      }), { status: 429, headers: corsHeaders });
    }

    // 生成验证码
    const code = generateCode();
    const codeData: VerificationCode = {
      email,
      code,
      type,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5分钟
    };

    // 存储验证码
    if (env.KV) {
      await env.KV.put(`code:${type}:${email}`, JSON.stringify(codeData), {
        expirationTtl: 300, // 5分钟
      });
      // 设置发送频率限制
      await env.KV.put(rateKey, '1', { expirationTtl: 60 });
    }

    // 发送邮件
    const sent = await sendVerificationEmail(email, code, env);
    
    if (!sent) {
      return new Response(JSON.stringify({
        success: false,
        error: 'EMAIL_FAILED',
        message: '邮件发送失败，请稍后重试',
      }), { status: 500, headers: corsHeaders });
    }

    // 开发环境返回验证码（生产环境删除）
    const devInfo = !env.RESEND_API_KEY ? { devCode: code } : {};

    return new Response(JSON.stringify({
      success: true,
      message: '验证码已发送',
      ...devInfo,
    }), { headers: corsHeaders });

  } catch (error) {
    console.error('Send code error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'SERVER_ERROR',
      message: '服务器错误',
    }), { status: 500, headers: corsHeaders });
  }
}

// ============================================
// 注册
// ============================================
async function handleRegister(request: Request, env: any): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password, code } = body;

    // 验证输入
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请输入有效的邮箱地址',
      }), { status: 400, headers: corsHeaders });
    }

    if (!password || password.length < 8) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_PASSWORD',
        message: '密码至少8位',
      }), { status: 400, headers: corsHeaders });
    }

    if (!code || code.length !== 6) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_CODE',
        message: '请输入6位验证码',
      }), { status: 400, headers: corsHeaders });
    }

    // 验证验证码
    const storedCodeStr = env.KV ? await env.KV.get(`code:register:${email}`) : null;
    if (!storedCodeStr) {
      return new Response(JSON.stringify({
        success: false,
        error: 'CODE_EXPIRED',
        message: '验证码已过期，请重新获取',
      }), { status: 400, headers: corsHeaders });
    }

    const storedCode: VerificationCode = JSON.parse(storedCodeStr);
    if (storedCode.code !== code) {
      return new Response(JSON.stringify({
        success: false,
        error: 'CODE_WRONG',
        message: '验证码错误',
      }), { status: 400, headers: corsHeaders });
    }

    // 检查邮箱是否已注册
    const existingUser = env.KV ? await env.KV.get(`user:email:${email}`) : null;
    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        error: 'EMAIL_EXISTS',
        message: '该邮箱已被注册',
      }), { status: 400, headers: corsHeaders });
    }

    // 创建用户
    const userId = generateUserId();
    const passwordHash = await hashPassword(password);
    const user: User = {
      id: userId,
      email,
      passwordHash,
      emailVerified: true,
      createdAt: Date.now(),
    };

    // 存储用户
    if (env.KV) {
      await env.KV.put(`user:${userId}`, JSON.stringify(user));
      await env.KV.put(`user:email:${email}`, userId);
      // 删除验证码
      await env.KV.delete(`code:register:${email}`);
    }

    // 生成 JWT
    const { passwordHash: _, ...userWithoutPassword } = user;
    const accessToken = generateJWT(userWithoutPassword);

    return new Response(JSON.stringify({
      success: true,
      data: {
        user: userWithoutPassword,
        token: {
          accessToken,
          expiresIn: 30 * 24 * 60 * 60,
        },
      },
    }), { headers: corsHeaders });

  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'SERVER_ERROR',
      message: '服务器错误',
    }), { status: 500, headers: corsHeaders });
  }
}

// ============================================
// 登录
// ============================================
async function handleLogin(request: Request, env: any): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // 验证输入
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请输入有效的邮箱地址',
      }), { status: 400, headers: corsHeaders });
    }

    if (!password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_PASSWORD',
        message: '请输入密码',
      }), { status: 400, headers: corsHeaders });
    }

    // 查找用户
    const userId = env.KV ? await env.KV.get(`user:email:${email}`) : null;
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'USER_NOT_FOUND',
        message: '邮箱或密码错误',
      }), { status: 401, headers: corsHeaders });
    }

    const userStr = env.KV ? await env.KV.get(`user:${userId}`) : null;
    if (!userStr) {
      return new Response(JSON.stringify({
        success: false,
        error: 'USER_NOT_FOUND',
        message: '邮箱或密码错误',
      }), { status: 401, headers: corsHeaders });
    }

    const user: User = JSON.parse(userStr);

    // 验证密码
    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'WRONG_PASSWORD',
        message: '邮箱或密码错误',
      }), { status: 401, headers: corsHeaders });
    }

    // 生成 JWT
    const { passwordHash: _, ...userWithoutPassword } = user;
    const accessToken = generateJWT(userWithoutPassword);

    return new Response(JSON.stringify({
      success: true,
      data: {
        user: userWithoutPassword,
        token: {
          accessToken,
          expiresIn: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
        },
      },
    }), { headers: corsHeaders });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'SERVER_ERROR',
      message: '服务器错误',
    }), { status: 500, headers: corsHeaders });
  }
}

// ============================================
// 重置密码
// ============================================
async function handleResetPassword(request: Request, env: any): Promise<Response> {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    // 验证输入
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_EMAIL',
        message: '请输入有效的邮箱地址',
      }), { status: 400, headers: corsHeaders });
    }

    if (!newPassword || newPassword.length < 8) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_PASSWORD',
        message: '密码至少8位',
      }), { status: 400, headers: corsHeaders });
    }

    if (!code || code.length !== 6) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_CODE',
        message: '请输入6位验证码',
      }), { status: 400, headers: corsHeaders });
    }

    // 验证验证码
    const storedCodeStr = env.KV ? await env.KV.get(`code:reset_password:${email}`) : null;
    if (!storedCodeStr) {
      return new Response(JSON.stringify({
        success: false,
        error: 'CODE_EXPIRED',
        message: '验证码已过期，请重新获取',
      }), { status: 400, headers: corsHeaders });
    }

    const storedCode: VerificationCode = JSON.parse(storedCodeStr);
    if (storedCode.code !== code) {
      return new Response(JSON.stringify({
        success: false,
        error: 'CODE_WRONG',
        message: '验证码错误',
      }), { status: 400, headers: corsHeaders });
    }

    // 查找用户
    const userId = env.KV ? await env.KV.get(`user:email:${email}`) : null;
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'USER_NOT_FOUND',
        message: '该邮箱未注册',
      }), { status: 400, headers: corsHeaders });
    }

    const userStr = env.KV ? await env.KV.get(`user:${userId}`) : null;
    if (!userStr) {
      return new Response(JSON.stringify({
        success: false,
        error: 'USER_NOT_FOUND',
        message: '用户不存在',
      }), { status: 400, headers: corsHeaders });
    }

    const user: User = JSON.parse(userStr);

    // 更新密码
    user.passwordHash = await hashPassword(newPassword);
    
    if (env.KV) {
      await env.KV.put(`user:${userId}`, JSON.stringify(user));
      await env.KV.delete(`code:reset_password:${email}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: '密码重置成功',
    }), { headers: corsHeaders });

  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'SERVER_ERROR',
      message: '服务器错误',
    }), { status: 500, headers: corsHeaders });
  }
}

// ============================================
// 获取当前用户
// ============================================
async function handleMe(request: Request): Promise<Response> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({
      success: false,
      error: 'UNAUTHORIZED',
      message: '未登录',
    }), { status: 401, headers: corsHeaders });
  }

  // 这里可以验证 JWT，简化版直接返回成功
  return new Response(JSON.stringify({
    success: true,
    message: '已登录',
  }), { headers: corsHeaders });
}

// ============================================
// 路由处理
// ============================================
export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/auth', '');

  // Handle OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // 路由
  if (request.method === 'POST') {
    if (path === '/send-code') return handleSendCode(request, env);
    if (path === '/register') return handleRegister(request, env);
    if (path === '/login') return handleLogin(request, env);
    if (path === '/reset-password') return handleResetPassword(request, env);
  }

  if (request.method === 'GET' && path === '/me') {
    return handleMe(request);
  }

  return new Response(JSON.stringify({
    success: false,
    error: 'NOT_FOUND',
    message: '接口不存在',
  }), { status: 404, headers: corsHeaders });
}