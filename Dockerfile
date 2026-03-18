# Railway 部署 Dockerfile
FROM node:22-slim

WORKDIR /app

# 复制 package.json
COPY server/package*.json ./

# 安装依赖 - 明确使用 npm
RUN npm install --legacy-peer-deps

# 复制源代码
COPY server/src ./src
COPY server/tsconfig.json ./

# 构建
RUN npm run build

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
EXPOSE 3001

# 启动
CMD ["node", "dist/index.js"]