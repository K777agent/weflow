"use client";

import Link from "next/link";
import { Phone, MessageSquare, BookOpen, ClipboardCheck } from "lucide-react";

export default function FloatingQuickBar() {
  const quickLinks = [
    {
      name: "24시간 상담",
      icon: <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-500" />,
      href: "tel:010-2971-7280",
      isExternal: true,
    },
    {
      name: "카톡 문의",
      icon: <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />,
      href: "http://pf.kakao.com/_xntCbX",
      isExternal: true,
    },
    {
      name: "블로그",
      icon: <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />,
      href: "https://m.blog.naver.com/weflowlab",
      isExternal: true,
    },
    {
      name: "무료 진단",
      icon: <ClipboardCheck className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />,
      href: "/diagnosis",
      isExternal: false,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[92%] max-w-lg -translate-x-1/2 transform rounded-2xl border border-gray-200/50 bg-white/70 px-2 py-3 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-gray-800/50 dark:bg-[#030712]/75 hover:shadow-blue-500/10 md:px-4 md:py-3.5">
      <div className="grid grid-cols-4 items-center justify-items-center gap-1">
        {quickLinks.map((link) => {
          const content = (
            <div className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100/80 transition-colors hover:bg-gray-200/50 dark:bg-gray-800/80 dark:hover:bg-gray-700/60 md:h-10 md:w-10">
                {link.icon}
              </div>
              <span className="text-[10px] font-semibold tracking-tight text-gray-700 dark:text-gray-300 md:text-xs">
                {link.name}
              </span>
            </div>
          );

          return link.isExternal ? (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center"
            >
              {content}
            </a>
          ) : (
            <Link key={link.name} href={link.href} className="w-full text-center">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
