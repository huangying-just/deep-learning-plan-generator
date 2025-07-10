import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "深度学习方案生成器",
  description: "智能生成专家级学习方案的应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
