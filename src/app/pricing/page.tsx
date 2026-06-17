import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";
import PricingCards from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-12 px-4 md:py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              제작 플랜 & <span className="text-blue-600 dark:text-blue-400">가격 안내</span>
            </h1>
            <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              위플로우는 불필요한 거품을 걷어내고 업종별 타겟 전환에 <br /> 꼭 필요한 실용적 기능과 구조만을 제안합니다.
            </p>
          </div>

          <PricingCards />
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
