# 内容工坊 - 研究发现与决策记录

## 技术发现

### 2024-03-18: 项目现状分析

**技术栈确认**
- 前端: React 19 + TypeScript + Vite + TailwindCSS 4
- 部署: Cloudflare Pages
- 认证: Google OAuth (已集成 @react-oauth/google)
- 数据: 暂无持久化，用户数据存内存

**已有文档**
- `docs/requirements.md` - 用户认证系统需求文档
- `docs/technical.md` - 用户认证系统技术文档
- `docs/google-oauth-setup.md` - Google OAuth 配置指南

**部署分支**
- `main` 分支 → 免费版本 (无登录)
- `pro` 分支 → Pro 版本 (带 Google 登录)

---

## 支付方案调研

### PayPal
- **优点**: 全球用户多，品牌信任度高
- **缺点**: 审核严格，中国开发者账号受限
- **适用**: 海外市场首选

### Stripe
- **优点**: 开发者体验好，API 完善
- **缺点**: 不支持中国大陆商家
- **适用**: 需要海外公司主体

### Lemonsqueezy
- **优点**: Merchant of Record，自动处理税务
- **缺点**: 手续费较高 (5%+支付费)
- **适用**: 无海外公司的最佳选择

### Paddle
- **优点**: 类似 Lemonsqueezy，税务处理完善
- **缺点**: 需要审核，入驻周期长
- **适用**: 规模化后考虑

**决策**: 优先 PayPal + Lemonsqueezy 双轨并行

---

## 定价策略调研

### 竞品参考
| 产品 | 免费版 | Pro | Enterprise |
|------|--------|-----|------------|
| Copy.ai | 2000字/月 | $49/月 | 定制 |
| Jasper | 7天试用 | $49/月起 | 定制 |
| Writesonic | 10000字 | $19/月 | 定制 |

### 建议
- Pro 定价: $9.9/月 (入门级，降低决策门槛)
- 年付优惠: 8折 ($95/年)
- 试用: 7天免费试用 Pro 功能

---

## SEO 策略调研

### 技术选型
- **当前**: SPA (React)，SEO 不友好
- **方案**: 
  1. Vite SSG (静态生成) - 简单快速
  2. Remix (SSR) - 功能完整但改动大
  3. Next.js - 需要重构

**决策**: 优先 Vite SSG，保持现有架构

### 关键词策略
- 主要关键词: AI content generator, AI writing tool, content creation
- 长尾关键词: AI product description generator, AI social media post generator
- 中文关键词: AI 内容生成, AI 写作工具

---

## 国际化注意事项

### 语言优先级
1. 英语 (全球市场)
2. 中文 (国内市场)
3. 日语 (日本市场，付费意愿强)

### 货币支持
- USD (默认)
- EUR (欧洲)
- JPY (日本)
- CNY (国内，需单独方案)

### 合规要求
- GDPR (欧洲): 必须合规
- CCPA (加州): 必须合规
- Cookie 同意: 必须实现

---

---

## Phase 0 执行记录

### 2024-03-18: 基础设施分析

**代码现状**
- 前端: 已完成完整的登录/注册/重置密码 UI
- 后端: API 已实现，等待 KV 绑定
- 存储: 代码支持 KV，但未配置

**需要配置的资源**
1. Cloudflare KV Namespace - 存储用户数据和验证码
2. Resend API Key - 发送验证码邮件

**认证问题**
- 现有 Cloudflare API Token 认证失败
- 需要手动在 Dashboard 配置，或获取新 Token

**决策**: 先完成手动配置，让邮箱登录功能上线

| 日期 | 决策 | 原因 |
|------|------|------|
| 2024-03-18 | 优先 PayPal + Lemonsqueezy | 海外支付双轨保障 |
| 2024-03-18 | Pro 定价 $9.9/月 | 降低决策门槛 |
| 2024-03-18 | Vite SSG 做 SEO | 改动最小 |
| 2024-03-18 | 优先英语 + 中文 | 先主战场 |