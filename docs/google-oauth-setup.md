# Google OAuth 配置指南

## 1. 创建 Google OAuth 应用

1. 访问 [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. 创建新项目或选择现有项目
3. 点击「创建凭据」→「OAuth 客户端 ID」
4. 应用类型选择「Web 应用」
5. 添加授权 JavaScript 来源：
   - `https://pro.ai-content-studio-am5.pages.dev`
   - `http://localhost:5173` (开发环境)
6. 添加授权重定向 URI：
   - `https://pro.ai-content-studio-am5.pages.dev`
   - `http://localhost:5173` (开发环境)
7. 复制客户端 ID

## 2. 配置环境变量

### 前端配置

创建 `.env` 文件：

```bash
VITE_GOOGLE_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
```

### 后端配置

使用 wrangler secret 设置：

```bash
wrangler pages secret put GOOGLE_CLIENT_ID --project-name=ai-content-studio
```

输入你的 Google Client ID。

## 3. 部署

```bash
# 构建
npm run build

# 部署到 pro 分支
CLOUDFLARE_API_TOKEN=xxx wrangler pages deploy dist --project-name=ai-content-studio --branch=pro
```

## 4. 访问

- **Pro 版本（带登录）**: https://pro.ai-content-studio-am5.pages.dev
- **免费版本（无登录）**: https://main.ai-content-studio-am5.pages.dev

## 注意事项

1. Google 登录在中国大陆可能不稳定，建议同时支持其他登录方式
2. 首次使用需要配置 Google OAuth 凭据
3. 用户数据目前存储在内存中，需要配置 KV 或 D1 进行持久化