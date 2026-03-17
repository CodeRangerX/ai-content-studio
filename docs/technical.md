# 内容工坊 - 用户认证系统技术文档

## 1. 技术架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (React)                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  登录   │  │  注册   │  │ 找回密码 │  │ 用户中心│        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴────────────┴────────────┘              │
│                          │                                   │
│                    Auth Context                             │
│                    (状态管理)                                │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare Workers                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Routes                         │  │
│  │  /api/auth/register    - 注册                        │  │
│  │  /api/auth/login       - 登录                        │  │
│  │  /api/auth/logout      - 登出                        │  │
│  │  /api/auth/me          - 获取用户信息                │  │
│  │  /api/auth/verify      - 验证邮箱                    │  │
│  │  /api/auth/send-code   - 发送验证码                  │  │
│  │  /api/auth/reset-password - 重置密码                 │  │
│  │  /api/auth/refresh     - 刷新 Token                  │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Cloudflare │ │  Cloudflare │ │  邮件服务   │
    │     KV      │ │     D1      │ │  (Resend)   │
    │  (验证码)   │ │  (用户数据) │ │             │
    └─────────────┘ └─────────────┘ └─────────────┘
```

### 1.2 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | React 18 + TypeScript | 已有项目基础 |
| 状态管理 | React Context + useReducer | 轻量级方案 |
| UI 组件 | 自定义组件 | 复用现有样式 |
| 后端运行时 | Cloudflare Workers | Serverless |
| 数据库 | Cloudflare D1 | SQLite 兼容 |
| 缓存 | Cloudflare KV | 验证码存储 |
| 邮件服务 | Resend / SendGrid | 发送验证邮件 |
| 密码加密 | bcryptjs | 密码哈希 |
| Token | JWT | 无状态认证 |

---

## 2. 数据库设计

### 2.1 D1 Schema

```sql
-- 用户表
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  email_verified INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  last_login_at TEXT
);

-- 验证码表（备用，主要用 KV）
CREATE TABLE verification_codes (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL, -- 'register' | 'reset_password'
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Token 黑名单（用于登出）
CREATE TABLE token_blacklist (
  token TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_verification_email ON verification_codes(email, type);
```

### 2.2 KV 存储

```javascript
// 验证码存储结构
{
  "verify:register:user@example.com": {
    code: "123456",
    attempts: 0,
    expiresAt: 1234567890000
  },
  "verify:reset:user@example.com": {
    code: "654321",
    attempts: 0,
    expiresAt: 1234567890000
  }
}

// 限流存储
{
  "rate:send:user@example.com": 1,  // 发送次数
  "rate:login:user@example.com": 0  // 登录失败次数
}
```

---

## 3. API 设计

### 3.1 注册

**POST /api/auth/register**

Request:
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "code": "123456"
}
```

Response:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "usr_xxx",
      "email": "user@example.com",
      "emailVerified": false
    },
    "token": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 7200
    }
  }
}
```

Error:
```json
{
  "success": false,
  "error": "EMAIL_EXISTS",
  "message": "该邮箱已被注册"
}
```

### 3.2 登录

**POST /api/auth/login**

Request:
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "rememberMe": true
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_xxx",
      "email": "user@example.com",
      "nickname": "用户昵称"
    },
    "token": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 7200
    }
  }
}
```

### 3.3 发送验证码

**POST /api/auth/send-code**

Request:
```json
{
  "email": "user@example.com",
  "type": "register"  // "register" | "reset_password"
}
```

Response:
```json
{
  "success": true,
  "message": "验证码已发送"
}
```

### 3.4 验证邮箱

**POST /api/auth/verify**

Request:
```json
{
  "code": "123456"
}
```

Headers:
```
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "success": true,
  "message": "邮箱验证成功"
}
```

### 3.5 重置密码

**POST /api/auth/reset-password**

Request:
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewPassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "密码重置成功"
}
```

### 3.6 获取当前用户

**GET /api/auth/me**

Headers:
```
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "usr_xxx",
    "email": "user@example.com",
    "nickname": "昵称",
    "avatar": "https://...",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3.7 登出

**POST /api/auth/logout**

Headers:
```
Authorization: Bearer {accessToken}
```

Response:
```json
{
  "success": true,
  "message": "已登出"
}
```

### 3.8 刷新 Token

**POST /api/auth/refresh**

Request:
```json
{
  "refreshToken": "eyJ..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "expiresIn": 7200
  }
}
```

---

## 4. 安全设计

### 4.1 密码安全

```javascript
import bcrypt from 'bcryptjs';

// 密码加密（注册时）
const salt = await bcrypt.genSalt(12);
const passwordHash = await bcrypt.hash(password, salt);

// 密码验证（登录时）
const isValid = await bcrypt.compare(password, passwordHash);
```

### 4.2 JWT 设计

```javascript
// Access Token（2小时有效）
const accessToken = jwt.sign(
  { userId, email, type: 'access' },
  JWT_SECRET,
  { expiresIn: '2h' }
);

// Refresh Token（7天或30天）
const refreshToken = jwt.sign(
  { userId, type: 'refresh' },
  JWT_REFRESH_SECRET,
  { expiresIn: rememberMe ? '30d' : '7d' }
);
```

### 4.3 验证码安全

- 6位数字，5分钟有效期
- 同一邮箱 60秒内只能发送 1 次
- 验证失败 3 次，验证码失效
- 验证成功后立即标记已使用

### 4.4 限流设计

```javascript
// 发送验证码限流
const SEND_CODE_LIMIT = {
  windowMs: 60 * 1000,    // 1分钟
  max: 1                   // 最多 1 次
};

// 登录限流
const LOGIN_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5                    // 最多 5 次
};
```

### 4.5 CORS 配置

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
```

---

## 5. 前端实现

### 5.1 Auth Context

```typescript
// contexts/AuthContext.tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  sendCode: (email: string, type: 'register' | 'reset_password') => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}
```

### 5.2 Token 管理

```typescript
// utils/token.ts
export const TokenManager = {
  // 存储
  save(tokens: { accessToken: string; refreshToken: string }, rememberMe?: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('accessToken', tokens.accessToken);
    storage.setItem('refreshToken', tokens.refreshToken);
  },
  
  // 获取
  get(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken'),
    };
  },
  
  // 清除
  clear() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  },
};
```

### 5.3 API 拦截器

```typescript
// utils/api.ts
const api = axios.create({ baseURL: '/api' });

// 请求拦截：添加 Token
api.interceptors.request.use((config) => {
  const { accessToken } = TokenManager.get();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 响应拦截：处理 Token 过期
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，尝试刷新
      const { refreshToken } = TokenManager.get();
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken });
          TokenManager.save(data.data);
          // 重试原请求
          return api.request(error.config);
        } catch {
          // 刷新失败，跳转登录
          TokenManager.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 6. 邮件服务

### 6.1 Resend 配置

```javascript
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

async function sendVerificationEmail(email, code) {
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: '【内容工坊】验证码',
    html: `
      <h2>您好！</h2>
      <p>您的验证码是：<strong style="font-size: 24px;">${code}</strong></p>
      <p>验证码5分钟内有效，请勿泄露给他人。</p>
      <br />
      <p>— 内容工坊团队</p>
    `,
  });
}
```

### 6.2 邮件模板

- 注册验证码
- 密码重置验证码
- 欢迎邮件（注册成功后）

---

## 7. 部署配置

### 7.1 wrangler.toml

```toml
name = "ai-content-studio"
main = "functions/[[path]].ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "ai-content-studio-db"
database_id = "xxx-xxx-xxx"

[[kv_namespaces]]
binding = "KV"
id = "xxx-xxx-xxx"

[vars]
JWT_SECRET = "your-jwt-secret"
JWT_REFRESH_SECRET = "your-refresh-secret"
RESEND_API_KEY = "re_xxx"
ALLOWED_ORIGINS = "https://main.ai-content-studio-am5.pages.dev"
```

### 7.2 环境变量

| 变量名 | 说明 | 是否敏感 |
|--------|------|----------|
| JWT_SECRET | JWT 密钥 | 是 |
| JWT_REFRESH_SECRET | Refresh Token 密钥 | 是 |
| RESEND_API_KEY | Resend API 密钥 | 是 |
| ALLOWED_ORIGINS | 允许的 CORS 来源 | 否 |

---

## 8. 测试计划

### 8.1 单元测试

- 密码加密/验证
- JWT 生成/验证
- 验证码生成/验证
- 邮箱格式验证

### 8.2 集成测试

- 注册流程
- 登录流程
- 密码找回流程
- Token 刷新

### 8.3 安全测试

- SQL 注入
- XSS 攻击
- CSRF 攻击
- 暴力破解

---

## 9. 监控与日志

### 9.1 日志记录

```javascript
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'info',
  action: 'user_login',
  userId: user.id,
  ip: request.headers.get('CF-Connecting-IP'),
  userAgent: request.headers.get('User-Agent'),
}));
```

### 9.2 错误追踪

- Cloudflare Workers 日志
- 错误告警（邮件/飞书）

---

## 10. 开发计划

| 任务 | 预计时间 | 优先级 |
|------|----------|--------|
| 数据库 Schema 设计 | 0.5h | P0 |
| Workers API 开发 | 4h | P0 |
| 前端登录/注册页面 | 3h | P0 |
| 邮件服务集成 | 1h | P0 |
| 邮箱验证功能 | 2h | P1 |
| 密码找回功能 | 2h | P1 |
| 测试与优化 | 2h | P1 |

**总计：约 2 个工作日**