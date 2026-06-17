"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { casesData } from "@/lib/cases-data";
import { ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";

export default function CasesSection() {
  const [isMounted, setIsMounted] = useState(false);
  
  const swiperRef1 = useRef<SwiperClass | null>(null);
  const swiperRef2 = useRef<SwiperClass | null>(null);

  const baseUnit = casesData.slice(0, 8); // 8 items

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Split items into 2 rows of 4 cards each
  const row1Items = useMemo(() => baseUnit.slice(0, 4), [baseUnit]);
  const row2Items = useMemo(() => baseUnit.slice(4, 8), [baseUnit]);

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

  const isLoop1 = useMemo(() => row1Items.length > 1, [row1Items]);
  const isLoop2 = useMemo(() => row2Items.length > 1, [row2Items]);

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

  return (
    <section id="cases" className="w-full py-16 px-4 md:py-24 md:px-8 bg-white dark:bg-[#030712] transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
            업종별 <span className="text-blue-600 dark:text-blue-400">성공 사례</span>
          </h2>
          <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto hidden sm:block">
            어디서도 볼 수 없는 업종별 전환율 최적화 성공 사례를 확인해보세요. <br />
            단순 제작을 넘어 매출을 만듭니다.
          </p>
        </div>

        {/* 8 Cases Preview - Swiper on Mobile (2 independent rows), Grid on Desktop */}
        <div className="flex flex-col gap-6 w-full">
          {/* Row 1 Slider (Mobile) */}
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
                key={`cases-section-swiper-row1-${row1Repeated.length}-${isLoop1}`}
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
                      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 shadow-sm transition-all hover:scale-[1.01] hover:border-blue-500/20 hover:bg-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-blue-500/10 dark:hover:bg-gray-900/60"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 280px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Card Details */}
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
                        
                        {/* Click to details */}
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

          {/* Row 2 Slider (Mobile) */}
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
                key={`cases-section-swiper-row2-${row2Repeated.length}-${isLoop2}`}
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
                      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 shadow-sm transition-all hover:scale-[1.01] hover:border-blue-500/20 hover:bg-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-blue-500/10 dark:hover:bg-gray-900/60"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 280px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Card Details */}
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
                        
                        {/* Click to details */}
                        <div className="mt-auto pt-4 flex items-center text-xs font-bold text-blue-650 dark:text-blue-400 gap-0.5 group-hover:gap-1.5 transition-all">
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

          {/* Grid Container (Desktop) */}
          <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full px-4 sm:px-0">
            {baseUnit.map((item) => (
              <Link
                key={item.slug}
                href={`/cases/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 shadow-sm transition-all hover:scale-[1.01] hover:border-blue-500/20 hover:bg-white hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/30 dark:hover:border-blue-500/10 dark:hover:bg-gray-900/60"
              >
                {/* Image Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-850">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Card Details */}
                <div className="flex flex-1 flex-col p-4 md:p-5">
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
                  
                  {/* Click to details */}
                  <div className="mt-auto pt-4 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 gap-0.5 group-hover:gap-1.5 transition-all">
                    자세히 보기
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* View More redirects to Cases list page */}
        <div className="mt-16 text-center">
          <Link
            href="/cases"
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-blue-500/15 transition-all hover:bg-blue-750 hover:shadow-blue-500/25 active:scale-98 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            성공 사례 전체보기 (28개 모두 보기)
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
