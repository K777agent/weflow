import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-16 px-4 md:py-24 md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200/50 bg-white p-6 md:p-10 dark:border-gray-800/50 dark:bg-gray-950/20 shadow-sm">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">서비스 이용약관</h1>
          
          <div className="flex flex-col gap-6 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              본 약관은 WEFLOW(이하 &quot;회사&quot;)가 제공하는 웹사이트 기획·제작, 검색포털 최적화(SEO) 등록, 사후 광고 세팅 및 관리 대행 서비스 등(이하 &quot;서비스&quot;)을 이용함에 있어 회사와 의뢰인의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">1. 서비스의 정의 및 개시</h3>
              <p>회사는 의뢰인이 선택한 플랜(START 랜딩, GROW 홈페이지, MASTER 프리미엄 등) 및 케어플랜 계약 조건에 따라 다음과 같이 작업을 수행합니다.</p>
              <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-1">
                <li>웹 디자인 제작 및 도메인 연동 세팅 (도메인 등록비는 의뢰인 별도 지불)</li>
                <li>광고 세팅 및 연동 (광고 소모 비용은 의뢰인의 개별 계정에서 별도 청구)</li>
                <li>유지보수 케어플랜(월별 이미지 수정, 텍스트 업데이트 등 경미한 사항)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">2. 당사자 간의 의무</h3>
              <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-1">
                <li>회사는 약정된 제작 기간(3일~7일 내외)을 준수하며 성실하게 서비스를 개발 및 배송합니다.</li>
                <li>의뢰인은 제작에 필요한 텍스트 정보, 이미지 로고, 사업장 고유 정보 등을 원활히 제공할 의무가 있습니다. 의뢰인의 정보 제공 지연으로 발생한 제작 일정 지연은 회사가 책임지지 않습니다.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">3. 저작권의 귀속 및 사용 제한</h3>
              <p>제작이 완료되고 잔금 지급이 완료된 웹사이트의 소유권은 의뢰인에게 전면 이전됩니다. 단, 사이트에 이식된 이미지 폰트 라이센스는 본 용도 이외의 독립적인 제3의 2차 수정본 배포 시 추가 저작권 동의가 필요할 수 있습니다.</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">4. 면책 사항</h3>
              <p>회사는 포털사이트(네이버, 구글 등) 자체의 알고리즘 변경 및 노출 필터 강화로 인한 순위 하락이나 마케팅 광고 매체 정책 변화에 대하여는 직접적인 손해배상의 책임을 지지 않습니다. 다만, 유지보수 케어플랜 범위 내에서 최선의 조정을 지원합니다.</p>
            </div>
          </div>
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
