import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// 类型定义
interface GeneratePlanRequest {
  topic: string;
}

// 延迟初始化 OpenAI 客户端
function getClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });
}

// 速率限制存储（简单的内存存储，生产环境应使用 Redis）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// 获取客户端 IP
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         '127.0.0.1';
}

// 检查速率限制
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1小时
  const maxRequests = 5; // 每小时最多5次请求

  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// 系统 Prompt 模板
const SYSTEM_PROMPT = `
语言: 中文简体

用途: 此Prompt旨在帮助用户深度精通某个领域知识，通过系统化的学习和实践，掌握某个领域知识的各项技能。

---

第一步：请基于{用户输入}的内容，分析和判断和填入下面{占位符}

1. 知识定位

"我现在是零基础/初级/中级水平，想系统掌握{LLM:请基于用户输入填写}领域。请用金字塔原理构建学习路径：先列出该领域的核心支柱（3-5个），再为每个支柱划分初、中、高三个阶段的关键学习目标。"

2. 认知破壁

"作为{LLM:请基于用户输入填写}领域专家，你认为初学者最常见的3个认知误区是什么？针对每个误区，请给出：

误区的具体表现
背后的错误逻辑
正确的理解方式
实践检验方法"

3. 刻意训练

"针对{LLM:请基于用户输入填写}技能，设计为期21天的刻意训练计划：

每天1个关键训练任务（含具体操作步骤）
配套的反馈机制（如：自查清单/量化标准/常见错误对照表）
每周的突破性挑战项目"

4. 高手思维

"模拟{LLM:请基于用户输入填写}领域顶尖专家的思考方式，当面对{LLM:请基于用户输入填写}问题时，他们会：

如何拆解问题层次（用MECE原则分析）
调用哪些跨学科知识（列出3个非常规关联领域）
采用什么验证框架（如：第一性原理/逆向思维/博弈论等）"

5. 实战精进

"现在我要解决一个真实的{LLM:请基于用户输入填写}问题（具体描述）。请分阶段指导：

① 知识检索：需要查询哪些专业资源（含具体数据库/文献类型）
② 方案设计：提供3种不同理论依据的解决路径
③ 压力测试：设计3个极端场景检验方案鲁棒性
④ 迭代优化：根据测试结果的两阶段改进策略"

6. 元认知提升

"如何建立{LLM:请基于用户输入填写}领域的动态知识管理系统？请给出：

信息过滤机制（可信度评估标准）
知识联结图谱（核心概念间的动态关系）
技能迁移策略（举3个可横向拓展的相邻领域）
持续更新方法（行业前沿追踪渠道清单）"

进阶提示：

在任意环节追加"请用费曼技巧解释"或"用二八法则优化这个学习路径"，可获得针对性强化训练方案。

第二步：基于你填入后的System Prompt，输出针对性的学习训练方案。

约束条件：

第一步无需输出，仅输出第二步生成的结果，无需任何解释性说明。
输出开头第一句必须是：# {提炼8个字内的标题}
`;

export async function POST(request: NextRequest) {
  try {
    // 获取客户端 IP 并检查速率限制
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    // 解析请求体
    const body: GeneratePlanRequest = await request.json();
    
    // 验证输入
    if (!body.topic || typeof body.topic !== 'string') {
      return NextResponse.json(
        { error: '请输入有效的学习主题' },
        { status: 400 }
      );
    }

    const topic = body.topic.trim();
    if (topic.length < 2 || topic.length > 100) {
      return NextResponse.json(
        { error: '主题长度应在2-100个字符之间' },
        { status: 400 }
      );
    }

    // 构建用户 Prompt
    const userPrompt = `请严格按照你接收到的System Prompt的指示，为我生成一份关于 "${topic}" 的深度精通学习方案。`;

    // 调用 OpenRouter API
    const client = getClient();
    const response = await client.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 10000,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: '生成失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan: content });

  } catch (error) {
    console.error('Error generating plan:', error);
    
    // 根据错误类型返回不同的错误信息
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: '服务配置错误，请联系管理员' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: '请求过于频繁，请稍后再试' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: '生成失败，请重试' },
      { status: 500 }
    );
  }
}

// 只允许 POST 请求
export async function GET() {
  return NextResponse.json(
    { error: '不支持的请求方法' },
    { status: 405 }
  );
} 
