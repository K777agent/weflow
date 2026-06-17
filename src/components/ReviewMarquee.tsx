"use client";

import Link from "next/link";
import { useState } from "react";
import { reviewsData } from "@/lib/reviews-data";
import { Star, ChevronRight } from "lucide-react";

export default function ReviewMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  // Split reviews into two arrays for the two marquee rows
  const midPoint = Math.ceil(reviewsData.length / 2);
  const row1 = reviewsData.slice(0, midPoint);
  const row2 = reviewsData.slice(midPoint);

  // Duplicate arrays to create a seamless looping effect
  const doubledRow1 = [...row1, ...row1];
  const doubledRow2 = [...row2, ...row2];

  const ReviewCard = ({ review }: { review: typeof reviewsData[0] }) => (
    <div className="mx-3 w-[260px] flex-shrink-0 rounded-2xl border border-gray-200/50 bg-white/80 p-5 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-900/50 md:w-[320px]">
      <div className="flex items-center gap-0.5 text-yellow-400 mb-2">
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-100 leading-relaxed line-clamp-2 h-[36px]">
        &quot;{review.text}&quot;
      </p>
      <div className="mt-4 border-t border-gray-100 pt-2.5 dark:border-gray-700 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
          {review.author}
        </span>
        <span className="rounded-full bg-blue-50/50 px-2 py-0.5 text-[8px] font-bold text-blue-500 dark:bg-blue-950/30 dark:text-blue-400">
          Verified Client
        </span>
      </div>
    </div>
  );

  return (
    <section className="w-full py-16 px-4 bg-gray-50/30 dark:bg-gray-950/10 overflow-hidden transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            고객들의 <span className="text-blue-600 dark:text-blue-400">솔직한 후기</span>
          </h2>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            위플로우와 함께 성장하고 있는 고객분들의 <br className="sm:hidden" /> 리얼 비즈니스 피드백입니다.
          </p>
        </div>
        <Link
          href="/cases"
          className="inline-flex items-center gap-0.5 text-xs font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span className="hidden sm:inline">후기 </span>더보기
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Marquee Rows Container */}
      <div 
        className="relative flex flex-col gap-6 py-4 cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
      >
        {/* Decorative Blur Overlays for edges */}
        <div className="absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-gray-50/30 via-transparent to-transparent pointer-events-none dark:from-[#030712]/40" />
        <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-gray-50/30 via-transparent to-transparent pointer-events-none dark:from-[#030712]/40" />

        {/* Row 1 - Sliding Left */}
        <div className="flex overflow-hidden select-none">
          <div 
            className="animate-marquee-left"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {doubledRow1.map((review, idx) => (
              <ReviewCard key={`r1-${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>

        {/* Row 2 - Sliding Right */}
        <div className="flex overflow-hidden select-none">
          <div 
            className="animate-marquee-right"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {doubledRow2.map((review, idx) => (
              <ReviewCard key={`r2-${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
