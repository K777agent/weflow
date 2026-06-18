"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";
import { DiagnosisInput } from "@/lib/types";
import { ClipboardCheck, Check, Send, Sparkles, ChevronDown } from "lucide-react";
import { addInquiry } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function DiagnosisPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DiagnosisInput>({
    name: "",
    phone: "",
    type: "랜딩페이지 제작",
    industry: "",
    additionalRequests: "",
    privacyConsent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [placeholder, setPlaceholder] = useState("구현하고 싶으신 기능, 벤치마킹 사이트 주소, 혹은 기대하시는 디자인 분위기 등을 기재해주세요.");

  const [isOpenTypeSelect, setIsOpenTypeSelect] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const selectTypes = [
    "랜딩페이지 제작",
    "홈페이지 제작",
    "랜딩 & 홈페이지 제작",
    "기타(WEFLOW케어플랜)",
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPlaceholder("구현하고 싶으신 기능, 벤치마킹 사이트 주소, 혹은\n기대하시는 디자인 분위기 등을 기재해주세요.");
      } else {
        setPlaceholder("구현하고 싶으신 기능, 벤치마킹 사이트 주소, 혹은 기대하시는 디자인 분위기 등을 기재해주세요.");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setIsOpenTypeSelect(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("이름을 입력해주세요.");
    if (!formData.phone.trim()) return setError("연락처를 입력해주세요.");
    if (!formData.industry.trim()) return setError("업종을 입력해주세요.");
    if (!formData.privacyConsent) return setError("개인정보 동의가 필요합니다.");

    setError("");
    setIsSubmitting(true);

    // Supabase에 문의 데이터 저장
    try {
      await addInquiry(formData);
    } catch (err) {
      setIsSubmitting(false);
      return setError(err instanceof Error ? err.message : "접수 중 오류가 발생했습니다.");
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      router.push("/");
    }, 3500);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-12 px-4 md:py-20 md:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              웹사이트 <span className="text-blue-600 dark:text-blue-400">무료 진단 & 견적</span>
            </h1>
            <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto break-keep">
              현재 준비 중이신 프로젝트 또는 이미 운영 중인 사이트의 핵심 문제점을 정밀 분석하고 최적화 솔루션을 제안해 드립니다.
            </p>
          </div>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-blue-500/10 bg-white p-6 dark:border-blue-500/5 dark:bg-gray-950/20 shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">진단 신청이 정상 접수되었습니다!</h2>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 max-w-sm">
                접수 확인 후 담당 전문 플래너가 배정되어 24시간 이내에 직접 연락을 올리겠습니다. 잠시만 기다려주세요.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200/50 bg-white p-6 md:p-10 dark:border-gray-800/50 dark:bg-gray-950/20 shadow-xl">
              <div className="mb-6 flex items-center gap-2 rounded-xl bg-blue-50/50 p-3 text-xs text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="break-keep">상세히 기재해주실수록 한층 정교한 분석 솔루션을 제공받으실 수 있습니다.</span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">이름</label>
                    <input
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2.5 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">연락처</label>
                    <input
                      type="tel"
                      placeholder="010-1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2.5 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative" ref={typeDropdownRef}>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">제작 종류</label>
                    <button
                      type="button"
                      onClick={() => setIsOpenTypeSelect(!isOpenTypeSelect)}
                      className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white/50 px-3 py-3 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-[#030712]/50 dark:text-white dark:focus:border-blue-500 cursor-pointer"
                    >
                      <span className="truncate">{formData.type}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    </button>

                    {isOpenTypeSelect && (
                      <div className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-gray-250 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                        {selectTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, type });
                              setIsOpenTypeSelect(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 transition-colors"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">업종</label>
                    <input
                      type="text"
                      placeholder="예: 필라테스, 법률사무소"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2.5 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">상세 요청사항</label>
                  <textarea
                    placeholder={placeholder}
                    rows={4}
                    value={formData.additionalRequests}
                    onChange={(e) => setFormData({ ...formData, additionalRequests: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2.5 text-xs text-gray-900 outline-none resize-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                  />
                </div>

                <div className="flex items-start gap-2 py-1">
                  <input
                    type="checkbox"
                    id="privacyConsentDiag"
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="privacyConsentDiag" className="text-xs leading-tight text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                    개인정보 수집 및 진단 요청 동의 (필수)
                  </label>
                </div>

                {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "접수 중..." : "무료 분석 진단 접수하기"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
