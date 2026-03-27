// API 配置 - 免费版本
export const authConfig = {
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