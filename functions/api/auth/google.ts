// Google OAuth 验证 API
// 需要配置环境变量：GOOGLE_CLIENT_ID

interface GoogleUserInfo {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat: number;
  exp: number;
}

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified: boolean;
}

// 验证 Google ID Token
async function verifyGoogleToken(token: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const userInfo: GoogleUserInfo = await response.json();
    
    // 验证 issuer
    if (userInfo.iss !== 'https://accounts.google.com' && 
        userInfo.iss !== 'accounts.google.com') {
      return null;
    }
    
    // 验证 audience (client ID)
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId && userInfo.aud !== clientId) {
      return null;
    }
    
    // 验证 token 未过期
    if (userInfo.exp * 1000 < Date.now()) {
      return null;
    }
    
    return userInfo;
  } catch (error) {
    console.error('Google token verification failed:', error);
    return null;
  }
}

// 生成简单 JWT (生产环境应使用更安全的方式)
function generateJWT(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    userId: user.id,
    email: user.email,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天
  }));
  const signature = btoa(`${header}.${payload}`); // 简化版，生产环境需要真实签名
  return `${header}.${payload}.${signature}`;
}

// 存储用户到 KV (简化版，生产环境应使用 D1 数据库)
async function saveUser(user: User, env: any): Promise<void> {
  if (env.KV) {
    await env.KV.put(`user:${user.id}`, JSON.stringify(user));
    await env.KV.put(`user:email:${user.email}`, user.id);
  }
}

// 从 KV 获取用户
async function getUser(userId: string, env: any): Promise<User | null> {
  if (env.KV) {
    const userStr = await env.KV.get(`user:${userId}`);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return new Response(JSON.stringify({
        success: false,
        error: 'MISSING_CREDENTIAL',
        message: '缺少登录凭证',
      }), { status: 400, headers: corsHeaders });
    }

    // 验证 Google Token
    const googleUser = await verifyGoogleToken(credential);
    
    if (!googleUser) {
      return new Response(JSON.stringify({
        success: false,
        error: 'INVALID_TOKEN',
        message: '登录凭证无效或已过期',
      }), { status: 401, headers: corsHeaders });
    }

    // 检查邮箱是否已验证
    if (!googleUser.email_verified) {
      return new Response(JSON.stringify({
        success: false,
        error: 'EMAIL_NOT_VERIFIED',
        message: '请先验证您的 Google 邮箱',
      }), { status: 400, headers: corsHeaders });
    }

    // 创建或更新用户
    const user: User = {
      id: `google_${googleUser.sub}`,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      emailVerified: googleUser.email_verified,
    };

    // 保存用户到 KV
    await saveUser(user, env);

    // 生成 JWT
    const accessToken = generateJWT(user);

    return new Response(JSON.stringify({
      success: true,
      data: {
        user,
        token: {
          accessToken,
          expiresIn: 7 * 24 * 60 * 60,
        },
      },
    }), { headers: corsHeaders });

  } catch (error: any) {
    console.error('Google OAuth error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'SERVER_ERROR',
      message: '服务器错误，请稍后重试',
    }), { status: 500, headers: corsHeaders });
  }
}