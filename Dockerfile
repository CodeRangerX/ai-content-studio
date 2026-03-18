# Railway Dockerfile - 只构建 server 目录
FROM node:20-slim

WORKDIR /app

# 设置 npm 不检查更新
RUN npm config set update-notifier false

# 只复制 server 目录的 package.json
WORKDIR /app/server
COPY server/package.json ./

# 安装 server 依赖
RUN npm install --no-audit --no-fund

# 复制 server 源代码
COPY server/src ./src
COPY server/tsconfig.json ./

# 构建 server
RUN npm run build

# 创建数据目录
RUN mkdir -p /app/server/data

# 暴露端口
EXPOSE 3001

# 设置工作目录
WORKDIR /app/server

# 启动
CMD ["node", "dist/index.js"]