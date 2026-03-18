# Phase 0 配置指南

本文档指导完成内容工坊项目的基础设施配置。

## 前置条件

- Cloudflare 账号（liusopenai@gmail.com）
- 项目已部署到 Cloudflare Pages

---

## 步骤 1: 创建 KV Namespace

KV 用于存储验证码和用户数据。

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **KV**
3. 点击 **Create a namespace**
4. 名称填写: `ai-content-studio-kv`
5. 点击 **Add**

创建完成后，复制 **Namespace ID**（类似 `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

---

## 步骤 2: 绑定 KV 到 Pages 项目

1. 进入 **Workers & Pages** → **ai-content-studio** (Pages 项目)
2. 点击 **Settings** → **Functions**
3. 找到 **KV namespace bindings**
4. 点击 **Add binding**
   - Variable name: `KV`
   - KV namespace: 选择刚创建的 `ai-content-studio-kv`
5. 点击 **Save**

---

## 步骤 3: 配置 Resend 邮件服务

Resend 用于发送验证码邮件。

### 3.1 注册 Resend 账号

1. 访问 [resend.com](https://resend.com)
2. 使用 GitHub 账号登录
3. 进入 Dashboard → **API Keys**
4. 点击 **Create API Key**
5. 名称填写: `ai-content-studio`
6. 复制生成的 API Key（以 `re_` 开头）

### 3.2 添加 Secret 到 Pages

1. 回到 Cloudflare Dashboard
2. 进入 **ai-content-studio** → **Settings** → **Environment variables**
3. 点击 **Add** → **Secret**
4. 添加以下变量:
   - `RESEND_API_KEY` = `你的Resend API Key`
5. 选择环境: Production (和 Preview 如果需要)
6. 点击 **Save**

### 3.3 配置发件域名（可选但推荐）

1. 在 Resend Dashboard → **Domains**
2. 添加你的域名（如 `mail.yourdomain.com`）
3. 添加 DNS 记录验证
4. 更新邮件发送地址为你的域名

---

## 步骤 4: 更新 wrangler.toml

将步骤 1 获取的 Namespace ID 更新到配置文件：

```toml
[[kv_namespaces]]
binding = "KV"
id = "你的Namespace ID"
```

---

## 步骤 5: 重新部署

配置完成后需要重新部署：

```bash
# 构建
npm run build

# 部署到 pro 分支
CLOUDFLARE_API_TOKEN=xxx wrangler pages deploy dist --project-name=ai-content-studio --branch=pro
```

---

## 验证配置

部署完成后测试：

1. 访问 https://pro.ai-content-studio-am5.pages.dev
2. 点击注册
3. 输入邮箱，点击发送验证码
4. 检查邮箱是否收到验证码
5. 完成注册流程

---

## 常见问题

### Q: 开发环境如何测试？

开发环境没有 Resend API Key 时，验证码会直接返回在响应中（开发模式），可以在控制台看到。

### Q: 邮件发送失败？

检查：
1. Resend API Key 是否正确配置
2. 是否验证了发件域名
3. 检查 Cloudflare Workers 日志

### Q: 用户数据存储在哪里？

目前使用 KV 存储：
- `user:{userId}` - 用户信息
- `user:email:{email}` - 邮箱到用户ID的映射
- `code:{type}:{email}` - 验证码

---

## 配置清单

| 配置项 | 状态 | 说明 |
|--------|------|------|
| KV Namespace | ⬜ 待创建 | 存储用户数据和验证码 |
| KV Binding | ⬜ 待绑定 | 变量名: KV |
| Resend API Key | ⬜ 待获取 | 发送验证码邮件 |
| Secret 配置 | ⬜ 待添加 | RESEND_API_KEY |
| 重新部署 | ⬜ 待执行 | pro 分支 |