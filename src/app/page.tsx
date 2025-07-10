'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen, Sparkles, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { GeneratePlanRequest, GeneratePlanResponse } from '@/types';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('请输入要学习的主题');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlan('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() } as GeneratePlanRequest),
      });

      const data: GeneratePlanResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成方案失败');
      }

      setPlan(data.plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">深度学习方案生成器</h1>
          </div>
          <p className="text-lg text-gray-600">
            输入任何领域，获得专家级的系统化学习方案
          </p>
        </div>

        {/* 输入表单 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              选择学习主题
            </CardTitle>
            <CardDescription>
              例如：公共演讲、数据可视化、古典音乐欣赏、Python编程、投资理财等
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="输入你想深度学习的主题..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1"
                  maxLength={100}
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !topic.trim()}
                  className="px-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      生成方案
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* 加载状态 */}
        {isLoading && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-600">正在为您生成专业的学习方案...</p>
                  <p className="text-sm text-gray-500 mt-2">这可能需要10-30秒，请耐心等待</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 结果展示 */}
        {plan && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                您的学习方案
              </CardTitle>
              <CardDescription>
                基于深度精通学习方法论生成的专业方案
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-6">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-600 mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-600">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                    table: ({ children }) => <table className="w-full border-collapse border border-gray-300 mb-4">{children}</table>,
                    th: ({ children }) => <th className="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                  }}
                >
                  {plan}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 功能说明 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 知识定位</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                用金字塔原理构建学习路径，分层次掌握核心技能
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🧠 认知破壁</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                识别常见误区，建立正确的学习思维模式
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💪 刻意训练</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                21天系统化训练计划，配套反馈机制
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 页脚 */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 深度学习方案生成器 - 让学习更系统化</p>
          <p className="mt-1">每小时限制5次使用，请合理使用</p>
        </div>
      </div>
    </div>
  );
}
