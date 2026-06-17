import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";
import { MessageSquare, FileText, Palette, Code, Globe, Shield } from "lucide-react";
import Link from "next/link";

const NaverIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.2 3H21v18h-4.8l-7.4-11V21H4V3h4.8l7.4 11V3z" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.13 0-5.672-2.541-5.672-5.671s2.542-5.672 5.672-5.672c1.436 0 2.743.535 3.744 1.41l3.078-3.078C18.96 3.633 15.795 2.5 12.24 2.5 6.368 2.5 1.5 7.368 1.5 13.25S6.368 24 12.24 24c5.736 0 10.511-4.043 10.511-9.914 0-.671-.06-1.319-.171-1.943H12.24z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const DaangnIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.8 4.2c-.8-.8-2-1-3-.6l-1.4.6c.4.6.4 1.4 0 2L13 7.6c-.6.6-1.4.6-2 0l-5.6 5.6c-1 1-1.2 2.6-.4 3.8l6.6-6.6c.8.8.8 2 0 2.8l-5.8 5.8c1.2.8 2.8.6 3.8-.4l5.6-5.6c-.6-.6-.6-1.4 0-2l1.4-1.4c.6-.6 1.4-.6 2 0l.6-1.4c.4-1 .2-2.2-.6-3zm-9 12c-.4.4-1 .4-1.4 0s-.4-1 0-1.4 1-.4 1.4 0 .4 1 0 1.4z" />
  </svg>
);

const ThreadsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.1 0 4.15-.65 5.9-1.88l-1.42-1.42C15.08 19.5 13.56 20 12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8v1.5c0 .83-.67 1.5-1.5 1.5S17 14.33 17 13.5V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.35 0 2.58-.54 3.5-1.4.68.83 1.73 1.4 2.9 1.4 2.04 0 3.7-1.66 3.7-3.7V13.5C22 7.71 17.5 2 12 2zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
  </svg>
);

export default function ServicePage() {
  const steps = [
    {
      number: "01",
      title: "상담 · 진단",
      desc: "업종 및 제작 방향 확인",
      detail: <>사전 비즈니스 분석을 통해 시장 환경을 점검하고, 대표님의 업종 특성에 <br className="hidden sm:inline" /> 가장 유리한 웹 디자인 및 레이아웃 컨셉을 수립합니다.</>,
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    },
    {
      number: "02",
      title: "기획 · 설계",
      desc: "문의 구조 및 전략 설계",
      detail: <>유입된 사용자가 이탈 없이 실제 예약이나 상담 신청으로 이어지도록 <br className="hidden sm:inline" /> 시각적 시선 유도 흐름 및 문의 버튼의 레이아웃을 치밀하게 배치합니다.</>,
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
    },
    {
      number: "03",
      title: "디자인",
      desc: "브랜드 맞춤 화면 구성",
      detail: "트렌디하고 가독성이 풍부한 그래픽 리소스를 설계하고, 라이트/다크 테마 모두에서 일체의 왜곡 없이 프리미엄 톤앤매너가 드러나게 디자인합니다.",
      icon: <Palette className="h-5 w-5 text-teal-500" />,
    },
    {
      number: "04",
      title: "개발 · 테스트",
      desc: "기능구현 최적화 검수 및 수정",
      detail: <>반응형 웹 화면 개발과 함께, 디바이스 해상도에 맞춰 폰트 유실이나 이미지 잘림, <br className="hidden sm:inline" /> 반응 속도 저하(렉)가 없는지 다각도로 철저히 검수하고 수정합니다.</>,
      icon: <Code className="h-5 w-5 text-purple-500" />,
    },
    {
      number: "05",
      title: "SEO 상단등록",
      desc: "네이버 · 구글 · 사이트맵 등록",
      detail: <>네이버 서치어드바이저 및 구글 서치콘솔에 사이트맵과 RSS를 등록하고 <br className="hidden sm:inline" /> 기본 메타태그를 수립해 검색 시 사이트가 상단 노출되도록 보조합니다.</>,
      icon: <Globe className="h-5 w-5 text-green-500" />,
    },
    {
      number: "06",
      title: "광고운영 · 사후관리",
      desc: "인스타 · 블로그 · 네이버 광고 운영",
      detail: "사이트 운영에 필수적인 SNS 콘텐츠 업로드 채널 지원, 로컬 타겟 키워드 세팅 등 다채로운 마케팅 연동 운영을 원터치로 케어해 드립니다.",
      icon: <Shield className="h-5 w-5 text-red-500" />,
    },
  ];

  const systems = [
    { name: "서치어드바이저 상단등록", category: "SEO", icon: <NaverIcon className="h-4 w-4 text-[#03C75A]" /> },
    { name: "콘솔 상단등록 & 사이트맵 등록", category: "SEO", icon: <GoogleIcon className="h-4 w-4 text-[#4285F4]" /> },
    { name: "키워드 광고 세팅 및 노출", category: "AD", icon: <NaverIcon className="h-4 w-4 text-[#03C75A]" /> },
    { name: "플레이스 키워드 광고 세팅", category: "AD", icon: <DaangnIcon className="h-4 w-4 text-[#FF6E24]" /> },
    { name: "블로그 기획/포스팅 업로드", category: "SNS", icon: <NaverIcon className="h-4 w-4 text-[#03C75A]" /> },
    { name: "공식 카드뉴스 업로드", category: "SNS", icon: <InstagramIcon className="h-4 w-4 text-[#E1306C]" /> },
    { name: "공식 채널 업로드", category: "SNS", icon: <ThreadsIcon className="h-4 w-4 text-gray-900 dark:text-white" /> },
    { name: "사후 유지보수 피드백 시스템", category: "CARE", icon: <Shield className="h-4 w-4 text-blue-500" /> },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-16 px-4 md:py-24 md:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Main Title */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              제작 및 <span className="text-blue-600 dark:text-blue-400">광고 운영 프로세스</span>
            </h1>
            <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              WEFLOW는 단순한 웹사이트 소스 코드 조립에 그치지 않고, <br /> 기획부터 사후 검색 노출과 채널 마케팅까지 책임지고 이끕니다.
            </p>
          </div>

          {/* 6-Step Timeline Cards */}
          <div className="mb-20">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-3 dark:border-blue-400">
              6단계 제작 프로세스
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-3 md:gap-4 rounded-2xl border border-gray-200/50 bg-white/60 p-3.5 md:p-5 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md dark:border-gray-800/50 dark:bg-gray-950/30"
                >
                  <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-400">{step.number}</span>
                    <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white mt-0.5">{step.title}</h3>
                    <p className="text-[10px] md:text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5 leading-snug">{step.desc}</p>
                    <div className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 mt-2.5 leading-relaxed">{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Operations Aftercare Systems */}
          <div className="rounded-3xl border border-gray-200/50 bg-white/70 p-6 shadow-sm dark:border-gray-800/50 dark:bg-[#030712]/50 md:p-10">
            <div className="text-center mb-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                광고 운영 · 사후관리 패키지 시스템
              </h2>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                웹사이트 론칭은 시작일 뿐입니다. 다양한 플랫폼 노출을 <br className="sm:hidden" /> 원클릭 패키지로 올인원 제공합니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {systems.map((sys, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-3.5 md:p-4 transition-all hover:border-blue-500/20 hover:bg-white dark:border-gray-800/40 dark:bg-gray-900/20 dark:hover:bg-gray-900/60"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {sys.icon}
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-extrabold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                      {sys.category}
                    </span>
                  </div>
                  <h3 className="text-[11px] md:text-xs font-bold text-gray-800 dark:text-gray-100 leading-snug">
                    {sys.name}
                  </h3>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/diagnosis"
                className="rounded-full bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 active:scale-98"
              >
                무료 운영 진단 받기
              </Link>
            </div>
          </div>
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
