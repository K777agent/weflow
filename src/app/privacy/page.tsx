import Navbar from "@/components/Navbar";
import FloatingQuickBar from "@/components/FloatingQuickBar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow bg-[#f9fafb] text-gray-900 transition-colors duration-300 dark:bg-[#030712] dark:text-white py-16 px-4 md:py-24 md:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200/50 bg-white p-6 md:p-10 dark:border-gray-800/50 dark:bg-gray-950/20 shadow-sm">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">개인정보처리방침</h1>
          
          <div className="flex flex-col gap-6 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              WEFLOW(이하 &quot;회사&quot;)는 고객의 개인정보를 중요시하며, &quot;개인정보 보호법&quot; 등 관련 법령을 준수하고 있습니다. 회사는 개인정보처리방침을 통하여 고객께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">1. 수집하는 개인정보 항목</h3>
              <p>회사는 무료 온라인 진단 및 견적, 상담 예약 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
              <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-1">
                <li>필수항목: 이름, 연락처(전화번호), 업종, 제작 종류</li>
                <li>선택항목: 추가 요청사항, 참고 사이트 정보 등</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">2. 개인정보 수집 및 이용 목적</h3>
              <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
              <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-1">
                <li>홈페이지/랜딩페이지 제작 견적 산출 및 업종 상담 진행</li>
                <li>마케팅 세팅 지원 및 광고 채널(네이버/당근마켓) 연동 상담</li>
                <li>예약 접수 내용 확인 및 해피콜 연락</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">3. 개인정보의 보유 및 이용 기간</h3>
              <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
              <ul className="list-disc pl-5 mt-1.5 flex flex-col gap-1">
                <li>보존 항목: 이름, 연락처, 업종, 상담 종류</li>
                <li>보존 기간: 상담 종료 후 1년 (고객 동의 철회 시 즉시 파기)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">4. 개인정보 파기 절차 및 방법</h3>
              <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 파기하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하여 파기합니다.</p>
            </div>
          </div>
        </div>
      </main>

      <FloatingQuickBar />
      <Footer />
    </>
  );
}
