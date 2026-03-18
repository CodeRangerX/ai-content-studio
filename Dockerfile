# Railway Dockerfile - 多阶段构建
# 阶段1: 构建
FROM node:22-slim AS builder

WORKDIR /build

# 复制 package.json
COPY server/package*.json ./

# 安装依赖
RUN npm install --no-audit --no-fund --loglevel=error

# 复制源代码
COPY server/src ./src
COPY server/tsconfig.json ./

# 构建
RUN npm run build

# 阶段2: 运行
FROM node:22-slim

WORKDIR /app

# 复制构建产物
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 3001

# 启动
CMD ["node", "dist/index.js"]