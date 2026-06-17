"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";
import { getCases } from "@/lib/storage";
import { ArrowLeft, CheckCircle, Flame, Target } from "lucide-react";
import { CaseStudy } from "@/lib/types";

interface CasePageProps {
  params: {
    slug: string;
  };
}

export default function CaseDetailPage({ params }: CasePageProps) {
  const [caseItem, setCaseItem] = useState<CaseStudy | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const allCases = getCases();
    const found = allCases.find((item) => item.slug === params.slug);
    if (found) {
      setCaseItem(found);
    }
    setIsLoaded(true);
  }, [params.slug]);

  if (isLoaded && !caseItem) {
    notFound();
  }

  if (!caseItem) {
    return (
      <div className="min-h-screen bg-[#f9fafb] dark:bg-[#030712] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-12 px-4 md:py-20 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            성공 사례 목록으로 가기
          </Link>

          {/* Header Block */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 uppercase tracking-wide">
                {caseItem.category}
              </span>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white sm:text-3xl mt-2">
                {caseItem.title} 최적화 구축 사례
              </h1>
            </div>
            {caseItem.conversionRate && (
              <div className="flex items-center gap-2 rounded-2xl border border-blue-500/10 bg-blue-550/10 px-4 py-2 dark:border-blue-500/5 dark:bg-blue-950/10 shrink-0">
                <Flame className="h-5 w-5 text-blue-500 fill-current" />
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {caseItem.conversionRate}
                </span>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-gray-200/40 bg-gray-200 dark:border-gray-800/30 dark:bg-gray-800 mb-10 shadow-lg">
            <Image
              src={caseItem.image}
              alt={caseItem.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>

          {/* Split Content: Summary and Key Changes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Content (2 cols) */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="rounded-2xl border border-gray-200/50 bg-white/60 p-6 dark:border-gray-800/50 dark:bg-gray-950/20">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
                  <Target className="h-4.5 w-4.5 text-blue-500" />
                  프로젝트 요약
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {caseItem.details}
                  <br />
                  <br />
                  본 구축 프로젝트는 모바일 사용자 유치 동선 편의성 개선과 업종 타겟 키워드의 최적화 배치에 목표를 두었습니다. 특히, PC는 물론 모바일 브라우저 환경에서 발생하던 속도 지연(렉), 오버플로우로 인한 글자 잘림, 이미지 깨짐 문제를 완벽히 대응하여 이탈률을 절반 가까이 해소하였습니다.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200/50 bg-white/60 p-6 dark:border-gray-800/50 dark:bg-gray-950/20">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                  핵심 개선 최적화 포인트
                </h2>
                <ul className="flex flex-col gap-4">
                  <li className="flex gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-blue-500" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">모바일 UI/UX 디바이스 최적화</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        어떤 해상도의 모바일 기기에서도 레이아웃 뒤틀림 없이 최적화된 반응형 프레임웍 설계
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-blue-500" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">문의 유도 및 버튼 동선 배치</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        상담 전환 유도를 위해 마우스 오버, 스크롤 동선에 맞춘 CTA 버튼 배치 설계
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-blue-500" />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">검색포털 노출 등록 (SEO)</h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        네이버 서치어드바이저, 구글 서치콘솔 상단 최적화 메타데이터 정밀 이식
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Content Sidebar (1 col) */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <div className="rounded-2xl border border-gray-200/50 bg-white/60 p-5 dark:border-gray-800/50 dark:bg-gray-950/20">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-3">구축 개요</h3>
                <div className="flex flex-col gap-3.5 text-[11px]">
                  <div>
                    <span className="block text-gray-400 dark:text-gray-500">클라이언트</span>
                    <span className="font-bold text-gray-800 dark:text-gray-300">{caseItem.title}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 dark:text-gray-500">프로젝트 범위</span>
                    <span className="font-bold text-gray-800 dark:text-gray-300">기획 + UI 디자인 + 반응형 개발 + SEO</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 dark:text-gray-500">제작 소요 기간</span>
                    <span className="font-bold text-gray-800 dark:text-gray-300">약 5일 소요</span>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 p-5 text-white shadow-lg shadow-blue-500/10">
                <h3 className="text-xs font-bold mb-2">동일 업종이신가요?</h3>
                <p className="text-[10px] text-blue-100 leading-relaxed mb-4">
                  위플로우와 동일한 맞춤 전략으로 신규 문의와 매출 전환을 극대화해보세요.
                </p>
                <Link
                  href="/diagnosis"
                  className="block w-full rounded-xl bg-white py-2.5 text-center text-xs font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50"
                >
                  나의 업종 무료 진단받기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
