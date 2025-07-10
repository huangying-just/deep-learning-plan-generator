# 深度学习方案生成器 - 生产环境部署指南

## 部署概述

本应用支持在 Ubuntu 服务器上进行自部署，通过 `0.0.0.0` 和域名 `learningplan.cflp.ai` 访问。

## 系统要求

- Ubuntu 20.04 或更高版本
- Node.js 18.x 或更高版本
- Nginx (用于反向代理)
- PM2 (用于进程管理)
- SSL 证书 (用于 HTTPS)

## 部署步骤

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Nginx
sudo apt install nginx -y

# 安装 PM2
sudo npm install -g pm2
```

### 2. 项目部署

```bash
# 克隆项目到服务器
git clone <your-repo-url> /var/www/deep-learning-plan-generator
cd /var/www/deep-learning-plan-generator

# 设置环境变量
cp .env.local .env.production
# 编辑 .env.production 文件，设置生产环境变量
nano .env.production
```

### 3. 配置环境变量

在 `.env.production` 文件中设置：

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://learningplan.cflp.ai
OPENROUTER_API_KEY=your_actual_openrouter_api_key
NEXT_PUBLIC_APP_NAME=深度学习方案生成器
NEXT_PUBLIC_APP_DESCRIPTION=基于六步深度精通学习方法论的智能学习方案生成器
```

### 4. 执行部署脚本

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 5. 配置 Nginx

```bash
# 复制 Nginx 配置
sudo cp nginx.conf /etc/nginx/sites-available/learningplan.cflp.ai

# 创建软链接
sudo ln -s /etc/nginx/sites-available/learningplan.cflp.ai /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 6. 配置 SSL 证书

#### 使用 Let's Encrypt (推荐)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d learningplan.cflp.ai

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 使用自定义证书

```bash
# 将证书文件放置到适当位置
sudo mkdir -p /etc/nginx/ssl
sudo cp your_certificate.crt /etc/nginx/ssl/
sudo cp your_private.key /etc/nginx/ssl/

# 更新 nginx.conf 中的证书路径
sudo nano /etc/nginx/sites-available/learningplan.cflp.ai
```

### 7. 配置防火墙

```bash
# 允许 HTTP 和 HTTPS 流量
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### 8. 验证部署

```bash
# 检查应用状态
pm2 status

# 检查 Nginx 状态
sudo systemctl status nginx

# 测试应用访问
curl -I http://localhost:3010
curl -I https://learningplan.cflp.ai
```

## 常用管理命令

### PM2 管理

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs deep-learning-plan-generator

# 重启应用
pm2 restart deep-learning-plan-generator

# 停止应用
pm2 stop deep-learning-plan-generator

# 监控应用
pm2 monit
```

### Nginx 管理

```bash
# 重启 Nginx
sudo systemctl restart nginx

# 重载配置
sudo systemctl reload nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/learningplan.cflp.ai.access.log
```

## 监控和维护

### 日志位置

- 应用日志: `./logs/app.log`
- PM2 日志: `~/.pm2/logs/`
- Nginx 日志: `/var/log/nginx/`

### 性能监控

```bash
# 查看服务器资源使用情况
htop

# 查看应用性能
pm2 monit

# 查看 Nginx 状态
sudo systemctl status nginx
```

### 备份策略

```bash
# 备份应用代码
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/deep-learning-plan-generator

# 备份数据库（如果有）
# mysqldump -u root -p database_name > backup-$(date +%Y%m%d).sql
```

## 故障排除

### 常见问题

1. **应用无法启动**
   - 检查环境变量是否正确设置
   - 查看 PM2 日志: `pm2 logs deep-learning-plan-generator`

2. **域名无法访问**
   - 检查 DNS 解析是否正确
   - 检查 Nginx 配置: `sudo nginx -t`

3. **SSL 证书问题**
   - 检查证书是否过期: `sudo certbot certificates`
   - 更新证书: `sudo certbot renew`

4. **API 调用失败**
   - 检查 OpenRouter API 密钥是否正确
   - 查看应用日志中的错误信息

### 联系支持

如果遇到部署问题，请查看：
- 应用日志: `./logs/app.log`
- PM2 日志: `pm2 logs deep-learning-plan-generator`
- Nginx 日志: `/var/log/nginx/learningplan.cflp.ai.error.log`

## 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新部署
./deploy.sh
``` 