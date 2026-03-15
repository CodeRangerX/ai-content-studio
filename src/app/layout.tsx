import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI内容工坊 - 一键生成专业文案",
  description: "AI内容生成工具，一键生成营销文案、商品描述、社媒内容",
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