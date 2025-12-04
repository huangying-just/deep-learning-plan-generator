# 深度学习方案生成器

一个智能的学习方案生成应用，基于专家级学习方法论，为任何学习主题生成系统化的深度学习方案。

## 🎯 项目特色

- **专家级方法论**：基于六步深度精通学习法（知识定位→认知破壁→刻意训练→高手思维→实战精进→元认知提升）
- **智能生成**：使用 Google Gemini 1.5 Flash 模型，生成个性化学习方案
- **现代化界面**：基于 Next.js + Tailwind CSS + Shadcn/UI 构建的美观界面
- **速率控制**：内置请求频率限制，防止滥用

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm 或 yarn
- OpenRouter API 密钥

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd deep-learning-plan-generator
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件：
   ```bash
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 使用说明

1. 在输入框中输入你想学习的主题（例如：公共演讲、数据可视化、Python编程等）
2. 点击"生成方案"按钮
3. 等待10-30秒，系统将生成一份完整的学习方案
4. 方案包含六个核心模块：
   - 🎯 **知识定位**：构建学习路径
   - 🧠 **认知破壁**：识别学习误区
   - 💪 **刻意训练**：21天训练计划
   - 🎓 **高手思维**：专家思考模式
   - 🚀 **实战精进**：实际问题解决
   - 🔄 **元认知提升**：知识管理系统

## 🛠️ 技术栈

- **前端框架**：Next.js 15.3.5 (App Router)
- **UI 组件**：Shadcn/UI + Tailwind CSS
- **TypeScript**：完整的类型支持
- **AI 模型**：Google Gemini 2.5 Flash (via OpenRouter)
- **Markdown 渲染**：react-markdown

## 📁 项目结构

```
deep-learning-plan-generator/
├── src/
│   ├── app/
│   │   ├── api/generate/          # API 路由
│   │   ├── layout.tsx             # 根布局
│   │   └── page.tsx               # 主页面
│   ├── components/
│   │   └── ui/                    # UI 组件
│   ├── lib/
│   │   └── utils.ts               # 工具函数
│   └── types/
│       └── index.ts               # 类型定义
├── .env.local                     # 环境变量
├── package.json                   # 依赖配置
└── README.md                      # 项目说明
```

## 🔧 配置说明

### 环境变量

- `OPENROUTER_API_KEY`: OpenRouter API 密钥（必需）
- `NODE_ENV`: 环境模式（development/production）

### 速率限制

- 每个 IP 地址每小时限制 5 次请求
- 可在 `src/app/api/generate/route.ts` 中调整

## 🚀 部署

### Vercel 部署（推荐）

1. 将项目推送到 GitHub
2. 在 Vercel 中导入项目
3. 设置环境变量 `OPENROUTER_API_KEY`
4. 部署完成

### 自托管部署

1. 构建项目：
   ```bash
   npm run build
   ```

2. 启动生产服务器：
   ```bash
   npm start
   ```

## 📝 开发说明

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

### API 端点

- `POST /api/generate`: 生成学习方案
  - 请求体：`{ "topic": "学习主题" }`
  - 响应：`{ "plan": "生成的学习方案" }` 或 `{ "error": "错误信息" }`

## 🔒 安全性

- API 密钥通过环境变量安全存储
- 实施请求频率限制
- 输入验证和清理
- 错误处理和日志记录

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Shadcn/UI](https://ui.shadcn.com/) - UI 组件库
- [OpenRouter](https://openrouter.ai/) - AI 模型网关
- [Google Gemini](https://ai.google.dev/) - AI 模型

---

**联系方式**：如有问题或建议，请创建 Issue 或联系开发者。
