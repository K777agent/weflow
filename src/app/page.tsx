import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CarePlanBenefits from "@/components/CarePlanBenefits";
import CasesSection from "@/components/CasesSection";
import ReviewMarquee from "@/components/ReviewMarquee";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white">
        <HeroSection />
        <CarePlanBenefits />
        <CasesSection />
        <ReviewMarquee />
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
