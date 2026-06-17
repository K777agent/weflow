"use client";

import { useState } from "react";
import { DiagnosisInput } from "@/lib/types";
import { Check, Send } from "lucide-react";
import { addInquiry } from "@/lib/storage";

export default function FloatingSideForm() {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("이름을 입력해주세요.");
    if (!formData.phone.trim()) return setError("연락처를 입력해주세요.");
    if (!formData.industry.trim()) return setError("업종을 입력해주세요.");
    if (!formData.privacyConsent) return setError("개인정보 수집 및 이용에 동의해주세요.");

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
      setIsSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        type: "랜딩페이지 제작",
        industry: "",
        additionalRequests: "",
        privacyConsent: false,
      });
    }, 3000);
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200/50 bg-white/90 p-6 shadow-2xl backdrop-blur-md transition-colors duration-300 dark:border-gray-800/50 dark:bg-[#030712]/90">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">무료 진단 받기</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          기획부터 제작, 광고 연동까지 WEFLOW가 함께합니다.
        </p>
      </div>

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Check className="h-6 w-6" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-white">무료 진단 신청 완료</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            접수되었습니다. 24시간 이내에 신속하게 진단 후 연락드리겠습니다.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">이름</label>
            <input
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">연락처</label>
            <input
              type="tel"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">제작 종류</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:focus:border-blue-500 cursor-pointer"
            >
              <option value="랜딩페이지 제작">랜딩페이지 제작</option>
              <option value="홈페이지 제작">홈페이지 제작</option>
              <option value="랜딩 & 홈페이지 제작">랜딩 & 홈페이지 제작</option>
              <option value="기타(WEFLOW케어플랜)">기타 (WEFLOW 케어플랜)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">업종</label>
            <input
              type="text"
              placeholder="예: 필라테스, 법률사무소"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">추가 요청사항</label>
            <textarea
              placeholder="구현을 원하는 기능이나 특이사항을 적어주세요."
              rows={2}
              value={formData.additionalRequests}
              onChange={(e) => setFormData({ ...formData, additionalRequests: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-xs text-gray-900 outline-none resize-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
            />
          </div>

          <div className="flex items-start gap-2 py-1">
            <input
              type="checkbox"
              id="privacyConsent"
              checked={formData.privacyConsent}
              onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
              className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="privacyConsent" className="text-[10px] leading-tight text-gray-500 dark:text-gray-400 cursor-pointer select-none">
              개인정보 수집 및 상담 동의 (필수)
            </label>
          </div>

          {error && <p className="text-[10px] font-bold text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Send className="h-3.5 w-3.5" />
            {isSubmitting ? "접수 중..." : "무료진단 후 견적받기"}
          </button>
        </form>
      )}
    </div>
  );
}
