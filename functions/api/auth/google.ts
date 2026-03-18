// Google OAuth 验证 API
// 用户信息存储在 JWT 中（无状态方案）

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
async function verifyGoogleToken(token: string, clientId?: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    
    if (!response.ok) {
      console.error('Google tokeninfo API failed:', response.status, await response.text());
      return null;
    }
    
    const userInfo: GoogleUserInfo = await response.json();
    
    // 验证 issuer
    if (userInfo.iss !== 'https://accounts.google.com' && 
        userInfo.iss !== 'accounts.google.com') {
      console.error('Invalid issuer:', userInfo.iss);
      return null;
    }
    
    // 验证 audience (client ID)
    if (clientId && userInfo.aud !== clientId) {
      console.error('Audience mismatch. Expected:', clientId, 'Got:', userInfo.aud);
      return null;
    }
    
    // 验证 token 未过期
    if (userInfo.exp * 1000 < Date.now()) {
      console.error('Token expired');
      return null;
    }
    
    return userInfo;
  } catch (error) {
    console.error('Google token verification failed:', error);
    return null;
  }
}

// Base64 URL 编码
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 生成 JWT (简化版，用户信息存储在 payload 中)
function generateJWT(user: User): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({
    ...user,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30天
  }));
  const signature = base64UrlEncode(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
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
    const googleUser = await verifyGoogleToken(credential, env.GOOGLE_CLIENT_ID);
    
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

    // 创建用户对象
    const user: User = {
      id: `google_${googleUser.sub}`,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      emailVerified: googleUser.email_verified,
    };

    // 生成 JWT (用户信息存储在 token 中)
    const accessToken = generateJWT(user);

    return new Response(JSON.stringify({
      success: true,
      data: {
        user,
        token: {
          accessToken,
          expiresIn: 30 * 24 * 60 * 60, // 30天
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