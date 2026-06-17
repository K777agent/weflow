"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";
import { getCases } from "@/lib/storage";
import { casesData } from "@/lib/cases-data";
import { Search, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isMounted, setIsMounted] = useState(false);
  const [cases, setCases] = useState<typeof casesData>([]);

  const swiperRef1 = useRef<SwiperClass | null>(null);
  const swiperRef2 = useRef<SwiperClass | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setCases(getCases());

    const handleCasesChange = () => {
      setCases(getCases());
    };
    window.addEventListener("weflow_cases_changed", handleCasesChange);
    return () => window.removeEventListener("weflow_cases_changed", handleCasesChange);
  }, []);

  // Filter cases based on category and search query
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [cases, selectedCategory, searchQuery]);

  // Split filtered cases into 2 independent rows
  const row1Items = useMemo(() => {
    const half = Math.ceil(filteredCases.length / 2);
    return filteredCases.slice(0, half);
  }, [filteredCases]);

  const row2Items = useMemo(() => {
    const half = Math.ceil(filteredCases.length / 2);
    return filteredCases.slice(half);
  }, [filteredCases]);

  // Loop mode only if we have at least 2 items to loop between
  const isLoop1 = useMemo(() => row1Items.length > 1, [row1Items]);
  const isLoop2 = useMemo(() => row2Items.length > 1, [row2Items]);

  // Repeat items to ensure Swiper loop mode has at least 12 items to prevent infinite call stack crash
  const row1Repeated = useMemo(() => {
    if (row1Items.length === 0) return [];
    if (row1Items.length === 1) return row1Items;
    const repeats = Math.ceil(12 / row1Items.length);
    let result: typeof row1Items = [];
    for (let i = 0; i < repeats; i++) {
      result = result.concat(row1Items);
    }
    return result;
  }, [row1Items]);

  const row2Repeated = useMemo(() => {
    if (row2Items.length === 0) return [];
    if (row2Items.length === 1) return row2Items;
    const repeats = Math.ceil(12 / row2Items.length);
    let result: typeof row2Items = [];
    for (let i = 0; i < repeats; i++) {
      result = result.concat(row2Items);
    }
    return result;
  }, [row2Items]);

  const handleScrollLeft1 = () => {
    if (swiperRef1.current) swiperRef1.current.slidePrev();
  };

  const handleScrollRight1 = () => {
    if (swiperRef1.current) swiperRef1.current.slideNext();
  };

  const handleScrollLeft2 = () => {
    if (swiperRef2.current) swiperRef2.current.slidePrev();
  };

  const handleScrollRight2 = () => {
    if (swiperRef2.current) swiperRef2.current.slideNext();
  };

  const categories = ["전체", "스포츠/헬스", "전문직/상담", "생활/서비스", "식음료/F&B", "뷰티/에스테틱", "비즈니스", "학원/교육"];

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-12 px-4 md:py-20 md:px-8">
        <div className="mx-auto max-w-7xl font-sans">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              위플로우 <span className="text-blue-600 dark:text-blue-400">성공 사례</span>
            </h1>
            <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              다양한 업종에서 증명된 문의 전환 극대화 포트폴리오를 확인해 보세요.
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="mb-12 flex flex-col gap-6 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950/40">
              <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                placeholder="업종 또는 브랜드명을 검색해 보세요 (예: 필라테스, 법률)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl py-4 pl-12 pr-4 text-sm bg-transparent text-gray-900 placeholder-gray-400 outline-none dark:text-white"
              />
            </div>

            {/* Category Filter Tags */}
            {/* Mobile: 2 clean rows of 4 items each */}
            <div className="flex sm:hidden flex-col gap-2">
              <div className="flex justify-center gap-1.5">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 text-center rounded-full py-2 text-[10px] font-bold transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-lg dark:bg-blue-500"
                        : "border border-gray-200 bg-white text-gray-650 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex justify-center gap-1.5">
                {categories.slice(4, 8).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 text-center rounded-full py-2 text-[10px] font-bold transition-all ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-lg dark:bg-blue-500"
                        : "border border-gray-200 bg-white text-gray-650 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* PC/Tablet: Single row flex-wrap */}
            <div className="hidden sm:flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10 dark:bg-blue-500"
                      : "border border-gray-200 bg-white text-gray-650 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filtered Cases Count */}
          <div className="mb-6 text-xs font-semibold text-gray-500 dark:text-gray-400 max-w-6xl mx-auto">
            총 <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredCases.length}</span>건의 사례가 검색되었습니다.
          </div>

          {/* Cases Slider / Grid Wrapper */}
          {filteredCases.length > 0 ? (
            <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
              {/* Row 1 Slider (Mobile) */}
              {row1Items.length > 0 && (
                <div className="block sm:hidden relative group/slider1 w-full overflow-hidden">
                  {/* Left Arrow Button */}
                  {isLoop1 && (
                    <button
                      onClick={handleScrollLeft1}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 dark:bg-gray-850/70 dark:text-white dark:hover:bg-gray-850 opacity-60 hover:opacity-100"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}

                  {isMounted && (
                    <Swiper
                      key={`cases-page-swiper-row1-${row1Repeated.length}-${isLoop1}`}
                      onSwiper={(swiper) => {
                        swiperRef1.current = swiper;
                      }}
                      loop={isLoop1}
                      slidesPerView="auto"
                      spaceBetween={16}
                      className="w-full pb-4 px-4"
                    >
                      {row1Repeated.map((item, index) => (
                        <SwiperSlide key={`${item.slug}-${index}`} style={{ width: '280px' }}>
                          <Link
                            href={`/cases/${item.slug}`}
                            className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm transition-all hover:scale-[1.01] hover:border-blue-500/20 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
                          >
                            {/* Image */}
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-850">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 640px) 100vw, 280px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>

                            {/* Card Info */}
                            <div className="flex flex-1 flex-col p-4">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                  {item.category}
                                </span>
                                {item.conversionRate && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-550/10 px-2 py-0.5 text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                                    {item.conversionRate}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {item.title}
                              </h3>
                              <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {item.details}
                              </p>
                              <div className="mt-auto pt-4 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 gap-0.5 group-hover:gap-1.5 transition-all">
                                자세히 보기
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}

                  {/* Right Arrow Button */}
                  {isLoop1 && (
                    <button
                      onClick={handleScrollRight1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 dark:bg-gray-850/70 dark:text-white dark:hover:bg-gray-850 opacity-60 hover:opacity-100"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Row 2 Slider (Mobile) */}
              {row2Items.length > 0 && (
                <div className="block sm:hidden relative group/slider2 w-full overflow-hidden">
                  {/* Left Arrow Button */}
                  {isLoop2 && (
                    <button
                      onClick={handleScrollLeft2}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 dark:bg-gray-850/70 dark:text-white dark:hover:bg-gray-850 opacity-60 hover:opacity-100"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}

                  {isMounted && (
                    <Swiper
                      key={`cases-page-swiper-row2-${row2Repeated.length}-${isLoop2}`}
                      onSwiper={(swiper) => {
                        swiperRef2.current = swiper;
                      }}
                      loop={isLoop2}
                      slidesPerView="auto"
                      spaceBetween={16}
                      className="w-full pb-4 px-4"
                    >
                      {row2Repeated.map((item, index) => (
                        <SwiperSlide key={`${item.slug}-${index}`} style={{ width: '280px' }}>
                          <Link
                            href={`/cases/${item.slug}`}
                            className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm transition-all hover:scale-[1.01] hover:border-blue-500/20 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
                          >
                            {/* Image */}
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-850">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 640px) 100vw, 280px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>

                            {/* Card Info */}
                            <div className="flex flex-1 flex-col p-4">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                  {item.category}
                                </span>
                                {item.conversionRate && (
                                  <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-550/10 px-2 py-0.5 text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                                    {item.conversionRate}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {item.title}
                              </h3>
                              <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {item.details}
                              </p>
                              <div className="mt-auto pt-4 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 gap-0.5 group-hover:gap-1.5 transition-all">
                                자세히 보기
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}

                  {/* Right Arrow Button */}
                  {isLoop2 && (
                    <button
                      onClick={handleScrollRight2}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-gray-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95 dark:bg-gray-850/70 dark:text-white dark:hover:bg-gray-850 opacity-60 hover:opacity-100"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Grid Container (Desktop) */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
                {filteredCases.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/cases/${item.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm transition-all hover:scale-[1.01] hover:border-blue-500/20 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
                  >
                    {/* Image */}
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-850">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Info */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                          {item.category}
                        </span>
                        {item.conversionRate && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-550/10 px-2 py-0.5 text-[10px] font-extrabold text-blue-600 dark:text-blue-400">
                            {item.conversionRate}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {item.details}
                      </p>
                      <div className="mt-auto pt-4 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 gap-0.5 group-hover:gap-1.5 transition-all">
                        자세히 보기
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              검색 조건에 맞는 성공 사례가 없습니다. 다른 검색어를 입력해 보세요.
            </div>
          )}
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
