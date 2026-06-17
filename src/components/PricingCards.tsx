"use client";

import { useState } from "react";
import { Check, Crown } from "lucide-react";

type PlanCategory = "production" | "care" | "ads";

export default function PricingCards() {
  const [activeTab, setActiveTab] = useState<PlanCategory>("production");

  const productionPlans = [
    {
      name: "START 랜딩페이지",
      desc: "단일 상품 홍보 및 단순 비즈니스 소개에 최적화",
      originalPrice: "498,000원",
      discountPrice: "249,000원",
      highlight: false,
      features: [
        "랜딩페이지 1페이지 제작",
        "3~4일 빠른 제작 기간",
        "반응형 제작 (PC/모바일)",
        "문의 수집 폼 연동",
        "기본 SEO 등록 및 연동",
      ],
    },
    {
      name: "GROW 홈페이지",
      desc: "브랜드 신뢰도를 높이고 체계적인 정보를 전달",
      originalPrice: "1,980,000원",
      discountPrice: "990,000원",
      highlight: false,
      features: [
        "홈페이지 5페이지 내외 제작",
        "1주일 빠른 제작 기간",
        "반응형 제작 (PC/모바일)",
        "문의 수집 폼 연동",
        "카카오톡 실시간 상담 연동",
        "기본 SEO 노출 설정",
      ],
    },
    {
      name: "MASTER 프리미엄",
      desc: "제작부터 광고 유치 동선까지 다루는 프리미엄 결합형",
      originalPrice: "2,980,000원",
      discountPrice: "1,490,000원",
      highlight: true,
      features: [
        "홈페이지 + 랜딩페이지 패키지",
        "1~2주 정밀 제작 기간",
        "반응형 제작 (PC/모바일)",
        "프리미엄 기획 및 디테일 디자인",
        "예약 · 문의 종합 시스템 탑재",
        "SEO 검색 엔진 상단 최적화 등록",
        "광고 전환 동선 정밀 설계",
      ],
    },
  ];

  const carePlans = [
    {
      name: "WE CARE",
      desc: "기본적인 유지보수와 소셜 채널 운영의 첫 걸음",
      originalPrice: "월 170,000원",
      discountPrice: "월 89,000원~",
      highlight: false,
      features: [
        "유지보수 (텍스트/이미지 수정) 월 1회",
        "네이버 블로그 포스팅 월 1개 업로드",
        "인스타그램 업로드 월 4회 (주 1회)",
        "스레드 업로드 월 4회 (주 1회)",
        "SEO 검색엔진 포털 상단 노출 관리",
      ],
    },
    {
      name: "FLOW CARE",
      desc: "지역 및 로컬 광고 활성화와 고객 유치 강화",
      originalPrice: "월 378,000원",
      discountPrice: "월 189,000원~",
      highlight: false,
      features: [
        "유지보수 (기능/페이지 수정) 월 3회",
        "인스타그램 업로드 월 8회 (주 2회)",
        "스레드 업로드 월 8회 (주 2회)",
        "네이버 블로그 포스팅 월 2회 업로드",
        "네이버 키워드 광고 세팅 할인 (14.9만 → 7.9만)",
        "당근마켓 지역광고 세팅 50% 할인 (7.9만 → 3.9만)",
        "문의 전환 구조 상시 개선 분석",
        "SEO 검색 상단 유지 및 최적화 관리",
      ],
    },
    {
      name: "WEFLOW CARE",
      desc: "전문 마케팅 부서를 둔 것처럼 설계하는 올인원 시스템",
      originalPrice: "월 678,000원",
      discountPrice: "월 339,000원~",
      highlight: true,
      features: [
        "유지보수 (경미한 수정) 무제한 지원",
        "네이버 블로그 포스팅 월 4회 (주 1회)",
        "인스타그램 업로드 월 12회 (주 3회)",
        "스레드 업로드 월 12회 (주 3회)",
        "네이버 키워드 / 당근 플레이스 광고 세팅 무료",
        "월간 비즈니스 성과 보고서 및 분석",
        "랜딩페이지 유입 구조 상시 최적화 개선",
        "전반적 온라인 광고 관리 & SEO 최적화",
      ],
    },
  ];

  const adsPlans = [
    {
      name: "네이버 광고 (키워드 세팅)",
      desc: "가장 확실한 고관여 잠재 고객 타겟팅 검색 광고",
      originalPrice: "298,000원",
      discountPrice: "149,000원~",
      highlight: false,
      features: [
        "정밀 키워드 분석 및 경쟁률 진단",
        "네이버 파워링크 광고 세팅 지원",
        "전환율 높은 최적의 광고 문구 제작",
        "홈페이지 문의 수집 동선과 광고 연결",
        "네이버 톡톡 및 카카오 상담 연동",
        "광고 효율 분석 및 노출 성과 최적화",
      ],
    },
    {
      name: "당근 플레이스 광고 (지역 세팅)",
      desc: "매장 반경 로컬 고객들의 단골을 확보하는 맞춤형 광고",
      originalPrice: "158,000원",
      discountPrice: "79,000원~",
      highlight: false,
      features: [
        "매장 인근 지역 상세 키워드 분석",
        "당근 플레이스 프로필 광고 세팅",
        "지역 주민 공감을 이끄는 광고 문구 작성",
        "지역 타겟팅 세부 노출 설정 지원",
        "쿠폰 배포 및 단골 유입 랜딩 연결",
        "로컬 비즈니스 광고 성과 분석 피드백",
      ],
    },
  ];

  return (
    <section id="pricing" className="w-full py-16 px-4 md:py-24 md:px-8 bg-gray-50/50 dark:bg-gray-950/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
            합리적이고 투명한 <span className="text-blue-600 dark:text-blue-400">가격 안내</span>
          </h2>
          <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            정해진 가격 정책으로 예산 부담을 줄이고 <br className="sm:hidden" /> 합리적인 구성으로 퀄리티를 보장합니다.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-full bg-white p-1 shadow-md border border-gray-100 dark:bg-[#030712] dark:border-gray-800">
            <button
              onClick={() => setActiveTab("production")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activeTab === "production"
                  ? "bg-blue-600 text-white shadow-lg dark:bg-blue-500"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              제작 플랜
            </button>
            <button
              onClick={() => setActiveTab("care")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activeTab === "care"
                  ? "bg-blue-600 text-white shadow-lg dark:bg-blue-500"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              케어 플랜
            </button>
            <button
              onClick={() => setActiveTab("ads")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activeTab === "ads"
                  ? "bg-blue-600 text-white shadow-lg dark:bg-blue-500"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              광고 세팅
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 justify-center max-w-6xl mx-auto">
          {activeTab === "production" &&
            productionPlans.map((plan, idx) => (
              <PricingCard key={idx} plan={plan} />
            ))}
          {activeTab === "care" &&
            carePlans.map((plan, idx) => (
              <PricingCard key={idx} plan={plan} />
            ))}
          {activeTab === "ads" && (
            <div className="col-span-1 md:col-span-3 flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto w-full">
              {adsPlans.map((plan, idx) => (
                <div key={idx} className="w-full md:w-[48%]">
                  <PricingCard plan={plan} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing Policies (Korean notes from Page 10) */}
        <div className="mt-16 mx-auto max-w-3xl rounded-2xl border border-gray-200/50 bg-white/70 p-6 dark:border-gray-800/50 dark:bg-[#030712]/50">
          <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-4">안내 및 서비스 이용 고지사항</h4>
          <ul className="flex flex-col gap-2.5 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed list-disc pl-4">
            <li>도메인은 고객님 명의로 직접 등록되며 비용은 별도입니다. 위플로우에서 등록 대행 및 연결 세팅 과정은 무료 지원해 드립니다.</li>
            <li>광고비는 광고 매체(네이버, 당근마켓 등)의 본인 계정에 직접 결제수단을 등록해 결제되며, 위플로우는 전문 세팅 및 운영 관리만 담당합니다.</li>
            <li>유지보수는 단순 오탈자 교정, 이미지 교체, 링크 변경 등 경미한 수정을 기준으로 합니다. 새로운 페이지 추가나 신규 기능 개발은 별도 비용이 청구될 수 있습니다.</li>
            <li className="font-bold text-blue-600 dark:text-blue-400 list-none pl-0 ml-[-1rem] flex items-center gap-1.5 mt-2">
              <Check className="h-3.5 w-3.5" />
              도메인 연결 지원 완료 | 도메인 등록 대행 가능 | 도메인 비용 별도
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

interface PricingPlan {
  name: string;
  desc: string;
  originalPrice: string;
  discountPrice: string;
  highlight: boolean;
  features: string[];
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl p-6 md:p-8 transition-all duration-300 ${
        plan.highlight
          ? "border-2 border-blue-500 bg-white shadow-2xl scale-[1.03] dark:bg-[#080d1a] hover:scale-[1.04]"
          : "border border-gray-200/50 bg-white/60 shadow-sm dark:border-gray-800/50 dark:bg-[#030712]/40 hover:scale-[1.01]"
      }`}
    >
      {/* Crown Badge */}
      {plan.highlight && (
        <span className="absolute right-6 top-6 inline-flex items-center gap-0.5 rounded-full bg-blue-600 px-2 py-0.5 text-[8px] sm:px-3 sm:py-1 sm:text-[10px] font-extrabold text-white uppercase shadow-md dark:bg-blue-500 animate-pulse">
          <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
          RECOMMEND
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-950 dark:text-white pr-16 md:pr-0">{plan.name}</h3>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{plan.desc}</p>
      </div>

      {/* Pricing Display */}
      <div className="mb-6 border-b border-gray-100 pb-6 dark:border-gray-800 flex items-baseline gap-2 flex-wrap min-h-[36px]">
        {plan.originalPrice && (
          <span className="text-[11px] text-gray-450 line-through dark:text-gray-500">{plan.originalPrice}</span>
        )}
        <span className="text-xl font-black text-blue-600 dark:text-blue-400">{plan.discountPrice}</span>
        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-550 uppercase shrink-0">VAT 포함</span>
      </div>

      {/* Features list */}
      <ul className="flex flex-col gap-3.5 mb-8">
        {plan.features.map((feature: string, idx: number) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
            <Check className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400 mt-0.5" />
            <span className="leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <a
        href="/diagnosis"
        className={`mt-auto w-full rounded-2xl py-3 text-center text-xs font-bold transition-all ${
          plan.highlight
            ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
        }`}
      >
        문의 및 진단 신청하기
      </a>
    </div>
  );
}
