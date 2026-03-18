# Railway 部署 Dockerfile - 使用完整 Debian 镜像
FROM node:22-slim

# 安装编译工具
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制 package.json
COPY server/package*.json ./

# 使用 pnpm 安装（更稳定）
RUN npm install -g pnpm && pnpm install

# 复制源代码
COPY server/src ./src
COPY server/tsconfig.json ./

# 构建
RUN pnpm run build

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 3001

# 启动
CMD ["node", "dist/index.js"]