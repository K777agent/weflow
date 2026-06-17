import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MessageCircle } from "lucide-react";

// Inline Instagram icon
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Inline Facebook icon
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function Footer() {
  const contactLinks = {
    phone: "tel:010-2971-7280",
    kakao: "http://pf.kakao.com/_xntCbX",
    blog: "https://m.blog.naver.com/weflowlab",
    instagram: "https://www.instagram.com/weflowlab.kr?igsh=b2c1eTdwbHo2bWRt",
    facebook: "https://www.facebook.com/profile.php?fb_profile_edit_entry_point=%7B%22click_point%22%3A%22edit_profile_button%22%2C%22feature%22%3A%22profile_header%22%7D&id=61590187124682&sk=about",
  };

  return (
    <footer className="w-full border-t border-gray-200/50 bg-white/50 py-12 pb-32 transition-colors duration-300 dark:border-gray-800/50 dark:bg-[#030712]/50">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Company Info Column */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/logo.png"
                alt="WEFLOW"
                width={110}
                height={28}
                style={{ width: "auto", height: "auto" }}
                className="h-auto w-auto max-h-[28px] object-contain dark:invert"
              />
            </Link>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              제작부터 관리까지 비즈니스 성장을 함께합니다.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={contactLinks.phone}
                aria-label="전화 문의"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href="mailto:contact@weflowlab.kr"
                aria-label="이메일 문의"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={contactLinks.kakao}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오 채널"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={contactLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={contactLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="페이스북"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-400"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">서비스</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/service" className="hover:text-blue-600 dark:hover:text-blue-400">
                  홈페이지 제작 과정
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-blue-600 dark:hover:text-blue-400">
                  랜딩페이지 제작 과정
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-blue-600 dark:hover:text-blue-400">
                  광고 운영 · 관리 안내
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">WEFLOW 케어플랜</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">
                  WE 케어
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">
                  FLOW 케어
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400">
                  WEFLOW 케어
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">상담문의</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-gray-500 dark:text-gray-400">
              <li>
                <a href={contactLinks.phone} className="hover:text-blue-600 dark:hover:text-blue-400">
                  전화문의 (010-2971-7280)
                </a>
              </li>
              <li>
                <a href="mailto:contact@weflowlab.kr" className="hover:text-blue-600 dark:hover:text-blue-400">
                  이메일 문의
                </a>
              </li>
              <li>
                <a href={contactLinks.kakao} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                  카카오 채널 문의
                </a>
              </li>
              <li>
                <a href={contactLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                  인스타 문의
                </a>
              </li>
              <li>
                <a href={contactLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                  페이스북 문의
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Full-width divider line and bottom section */}
      <div className="mt-12 w-full border-t border-gray-150 pt-8 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-start justify-between gap-4 text-xs text-gray-500 dark:text-gray-400 md:flex-row md:items-center">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>대표 : 신서준</span>
                <span>사업자등록번호 : 884-07-03480</span>
                <span>이메일 : contact@weflowlab.kr</span>
              </div>
              <div>
                <span>운영시간 : 연중무휴 24시간 상담가능</span>
              </div>
            </div>
            
            {/* Right side: Links and Copyright on the same line on PC, split on mobile */}
            <div className="flex flex-col items-start md:items-end gap-1 w-full md:w-auto">
              <div className="flex items-center gap-3 font-medium text-[11px] md:text-xs">
                <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">
                  개인정보처리방침
                </Link>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white">
                  이용약관
                </Link>
                
                {/* Desktop: Copyright directly next to links */}
                <span className="hidden md:inline text-gray-300 dark:text-gray-700">|</span>
                <span className="hidden md:inline text-gray-400 dark:text-gray-500 font-normal">
                  &copy; 2026 WEFLOW. All rights reserved.
                </span>
              </div>
              
              {/* Mobile: Copyright on the next line, small */}
              <span className="block md:hidden text-[10px] text-gray-400 dark:text-gray-500 font-normal mt-1">
                &copy; 2026 WEFLOW. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
