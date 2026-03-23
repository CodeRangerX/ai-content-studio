// 认证配置
export const authConfig = {
  // Google OAuth Client ID - 需要在 Google Cloud Console 创建
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '331742752167-cu9qgt0l2bjja7n5prdbvl61n3ju5i3p.apps.googleusercontent.com',
  // API 基础 URL - 优先使用环境变量，否则使用相对路径（依赖代理）
  apiBaseUrl: import.meta.env.VITE_API_URL || '',
};

// 获取完整的 API URL
export function getApiUrl(path: string): string {
  if (authConfig.apiBaseUrl) {
    return `${authConfig.apiBaseUrl}${path}`;
  }
  return path; // 相对路径，依赖代理
}

// Token 存储
export const TokenManager = {
  getAccessToken: () => {
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  },
  
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  },
  
  save: (tokens: { accessToken: string; refreshToken?: string }, rememberMe?: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('accessToken', tokens.accessToken);
    if (tokens.refreshToken) {
      storage.setItem('refreshToken', tokens.refreshToken);
    }
  },
  
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  },
  
  getUser: () => {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  saveUser: (user: any, rememberMe?: boolean) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
  },
};