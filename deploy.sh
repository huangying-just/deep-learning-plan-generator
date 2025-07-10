#!/bin/bash

# 深度学习方案生成器 - 生产环境部署脚本
# 使用方法: ./deploy.sh

set -e

echo "🚀 开始部署深度学习方案生成器..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node --version
npm --version

# 安装依赖
echo "📦 安装生产依赖..."
npm ci --only=production

# 构建项目
echo "🏗️ 构建项目..."
npm run build

# 创建日志目录
echo "📁 创建日志目录..."
mkdir -p logs

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    echo "⚠️ PM2 未安装，正在安装..."
    npm install -g pm2
fi

# 停止现有进程
echo "🛑 停止现有进程..."
pm2 stop deep-learning-plan-generator 2>/dev/null || true
pm2 delete deep-learning-plan-generator 2>/dev/null || true

# 启动新进程
echo "🚀 启动新进程..."
pm2 start ecosystem.config.js --env production

# 保存 PM2 配置
echo "💾 保存 PM2 配置..."
pm2 save

# 设置 PM2 开机自启
echo "🔄 设置 PM2 开机自启..."
pm2 startup

# 显示状态
echo "📊 显示应用状态..."
pm2 status

echo "✅ 部署完成!"
echo "🌐 应用已启动在 http://0.0.0.0:3000"
echo "🌍 域名访问: https://learningplan.cflp.ai"
echo ""
echo "📝 常用命令:"
echo "  查看状态: pm2 status"
echo "  查看日志: pm2 logs deep-learning-plan-generator"
echo "  重启应用: pm2 restart deep-learning-plan-generator"
echo "  停止应用: pm2 stop deep-learning-plan-generator" 