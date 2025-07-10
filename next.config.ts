import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生产环境配置
  compress: true,
  
  // 允许外部访问
  serverExternalPackages: ['openai'],

  // 实验性功能
  experimental: {
  },
  
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // 输出配置
  output: 'standalone',
  
  // 安全头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
