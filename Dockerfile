# Railway 部署 Dockerfile - Node.js 后端
# 使用完整镜像以支持 better-sqlite3 编译
FROM node:22-alpine

# 安装编译工具（better-sqlite3 需要）
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 安装依赖
COPY server/package*.json ./
RUN npm install

# 复制源代码并构建
COPY server/src ./src
COPY server/tsconfig.json ./
RUN npm run build

# 创建数据目录
RUN mkdir -p /app/data

# 清理开发依赖（可选，减小镜像大小）
# RUN npm prune --production

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "dist/index.js"]