import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "WEFLOW | 문의로 이어지는 홈페이지 제작 · 광고 운영 · 검색 상단 노출",
  description: "홈페이지 제작부터 광고 연동, 운영 관리까지 단순 제작이 아닌 문의 구조까지 설계합니다. 24시간 상담 가능.",
  keywords: ["홈페이지 제작", "랜딩페이지 제작", "광고 운영", "검색 상단 노출", "웹 솔루션", "위플로우", "weflow"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
