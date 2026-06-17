"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "홈", href: "/" },
    { name: "서비스", href: "/service" },
    { name: "제작플랜 & 가격", href: "/pricing" },
    { name: "성공사례", href: "/cases" },
    { name: "예약", href: "/reservation" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/40 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800/40 dark:bg-[#030712]/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="WEFLOW"
            width={120}
            height={30}
            priority
            className="h-auto w-auto max-h-[30px] object-contain dark:invert"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/diagnosis"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-blue-500/30 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            무료 진단 받기
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="theme toggle"
            className="rounded-full p-2 text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300 dark:rotate-0" />
            ) : (
              <Moon className="h-5 w-5 rotate-0 scale-100 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="theme toggle mobile"
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="menu toggle"
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 transition-colors duration-300 dark:border-gray-850 dark:bg-[#030712] md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-1"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/diagnosis"
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full rounded-full bg-blue-600 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              무료 진단 받기
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
