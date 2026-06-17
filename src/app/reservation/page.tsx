"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";
import { ReservationInput } from "@/lib/types";
import { Calendar as CalendarIcon, Clock, Check, Send, ChevronDown } from "lucide-react";
import { addReservation } from "@/lib/storage";

export default function ReservationPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentHour, setCurrentHour] = useState<number>(0);
  const [todayString, setTodayString] = useState<string>("");

  const [formData, setFormData] = useState<ReservationInput>({
    name: "",
    phone: "",
    date: "",
    time: "",
    type: "랜딩페이지 제작",
    industry: "",
    additionalRequests: "",
    privacyConsent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [isOpenTypeSelect, setIsOpenTypeSelect] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const selectTypes = [
    "랜딩페이지 제작",
    "홈페이지 제작",
    "케어플랜 문의",
    "기타(광고세팅 및 상담)",
  ];

  // Available consultation time slots
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  // Set today's date context on mount to prevent SSR hydration mismatch
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setCurrentHour(today.getHours());
    
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    setTodayString(formatted);
    setSelectedDate(formatted); // Default to today
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: selectedDate,
      time: selectedTime,
    }));
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setIsOpenTypeSelect(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle changing dates
  const handleDateClick = (day: number) => {
    const tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const yyyy = tempDate.getFullYear();
    const mm = String(tempDate.getMonth() + 1).padStart(2, "0");
    const dd = String(tempDate.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    
    setSelectedDate(formatted);
    setSelectedTime(""); // Reset selected time when date changes
  };

  // Generate calendar days for current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty cells for alignment (days before first of month)
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    
    return days;
  };

  const daysArray = getDaysInMonth();
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // Check if a specific calendar day is in the past
  const isPastDate = (day: number | null) => {
    if (day === null) return true;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Check if a time slot is in the past for today
  const isPastTimeSlot = (time: string) => {
    if (selectedDate !== todayString) return false; // Not today, all unblocked
    const slotHour = parseInt(time.split(":")[0]);
    return slotHour <= currentHour; // Block slots prior or equal to current hour
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("이름을 입력해주세요.");
    if (!formData.phone.trim()) return setError("연락처를 입력해주세요.");
    if (!formData.date) return setError("예약 날짜를 선택해주세요.");
    if (!formData.time) return setError("예약 시간을 선택해주세요.");
    if (!formData.industry.trim()) return setError("업종을 입력해주세요.");
    if (!formData.privacyConsent) return setError("개인정보 동의가 필요합니다.");

    setError("");
    setIsSubmitting(true);

    // Supabase에 예약 데이터 저장
    try {
      await addReservation(formData);
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
        date: todayString,
        time: "",
        type: "랜딩페이지 제작",
        industry: "",
        additionalRequests: "",
        privacyConsent: false,
      });
      setSelectedTime("");
    }, 4000);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-12 px-4 md:py-20 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              상담 예약 <span className="text-blue-600 dark:text-blue-400">신청</span>
            </h1>
            <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
              달력에서 날짜를 선택하고 원하시는 시간대의 슬롯을 정해 <br className="sm:hidden" /> 상담 일정을 부킹하세요.
            </p>
          </div>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-blue-500/10 bg-white/70 p-6 dark:border-blue-500/5 dark:bg-gray-950/20 shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">상담 예약이 접수되었습니다!</h2>
              <div className="my-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-150 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 max-w-sm flex flex-col gap-2">
                <div>
                  <span className="text-gray-400">예약 고객:</span> <span className="font-bold">{formData.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">연락처:</span> <span className="font-bold">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400">예약 일시:</span> <span className="font-bold text-blue-600 dark:text-blue-400">{formData.date} / {formData.time}</span>
                </div>
                <div>
                  <span className="text-gray-400">구분:</span> <span className="font-bold">{formData.type}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                확인 후 기재해주신 번호로 조속히 전화를 드리겠습니다. 감사합니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Calendar & Time */}
              <div className="flex flex-col gap-6">
                
                {/* Calendar Card */}
                <div className="rounded-3xl border border-gray-200/50 bg-white p-5 dark:border-gray-800/50 dark:bg-gray-950/20 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs font-bold flex items-center gap-1.5 text-gray-900 dark:text-white">
                      <CalendarIcon className="h-4 w-4 text-blue-500" />
                      예약 날짜 선택
                    </h3>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </span>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {weekDays.map((wd) => (
                      <span key={wd} className="text-[10px] font-bold text-gray-400 dark:text-gray-500 py-1">{wd}</span>
                    ))}
                    
                    {daysArray.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} />;
                      }

                      const isPast = isPastDate(day);
                      const checkDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const isSelected = selectedDate === checkDateStr;

                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          disabled={isPast}
                          onClick={() => handleDateClick(day)}
                          className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 dark:bg-blue-500"
                              : isPast
                              ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                              : "text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection Card */}
                <div className="rounded-3xl border border-gray-200/50 bg-white p-5 dark:border-gray-800/50 dark:bg-gray-950/20 shadow-sm">
                  <h3 className="text-xs font-bold flex items-center gap-1.5 text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                    <Clock className="h-4 w-4 text-blue-500" />
                    예약 시간 선택 ({selectedDate || "날짜를 먼저 선택하세요"})
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {timeSlots.map((time) => {
                      const isPast = isPastTimeSlot(time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isPast || !selectedDate}
                          onClick={() => setSelectedTime(time)}
                          className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 dark:bg-blue-500"
                              : isPast
                              ? "bg-gray-50 text-gray-300 cursor-not-allowed dark:bg-gray-900/30 dark:text-gray-700"
                              : "border border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: User Details form */}
              <div className="rounded-3xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-950/20 shadow-sm flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-950 dark:text-white border-b border-gray-100 pb-2 dark:border-gray-850">
                  예약 상세 정보 입력
                </h3>

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

                  <div className="relative" ref={typeDropdownRef}>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">제작 종류</label>
                    <button
                      type="button"
                      onClick={() => setIsOpenTypeSelect(!isOpenTypeSelect)}
                      className="w-full flex items-center justify-between rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-[#030712]/50 dark:text-white dark:focus:border-blue-500 cursor-pointer text-left"
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
                    placeholder="예: 스포츠센터, 법무법인"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-xs text-gray-900 outline-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-400 mb-1">추가 요청사항</label>
                  <textarea
                    placeholder="희망하시는 기능 구성이나 궁금하신 부분을 작성해주세요."
                    rows={3}
                    value={formData.additionalRequests}
                    onChange={(e) => setFormData({ ...formData, additionalRequests: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-xs text-gray-900 outline-none resize-none transition-all focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white dark:focus:border-blue-500"
                  />
                </div>

                <div className="flex items-start gap-2 py-1">
                  <input
                    type="checkbox"
                    id="privacyConsentRes"
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="privacyConsentRes" className="text-[10px] leading-tight text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                    개인정보 수집 및 상담 대기 동의 (필수)
                  </label>
                </div>

                {error && <p className="text-xs font-bold text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "접수 중..." : "실시간 예약 접수하기"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
