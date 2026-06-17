import { Sparkles, Activity, Ship, BadgePercent, Headphones, CheckSquare, ArrowRight, ArrowDown } from "lucide-react";

export default function CarePlanBenefits() {
  const benefits = [
    {
      title: "WEFLOW 케어플랜",
      description: "기획부터 노출등록까지 위플로우 전담 매니저가 직접 밀착 관리해 드립니다.",
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "제작+운영+광고+관리 원터치",
      description: <>개발사, 대행사 따로 찾을 필요 없이 원스톱으로 <br /> 마케팅 채널 세팅까지 진행됩니다.</>,
      icon: <Activity className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: "빠른 제작 (3~7일 로켓배송)",
      description: "빠르게 제작하여 광고를 세팅하고 즉시 고객 문의 수집을 활성화합니다.",
      icon: <Ship className="h-6 w-6 text-teal-500" />,
    },
    {
      title: "합리적인 가성비",
      description: "불필요한 마진을 뺀 실질적이고 효과 높은 구조만 엄선하여 정직하게 제안합니다.",
      icon: <BadgePercent className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "24시간 상담대기",
      description: <>정해진 시간 제약 없이, 급한 수정이나 문의가 생길 때 <br /> 빠른 피드백을 지원합니다.</>,
      icon: <Headphones className="h-6 w-6 text-green-500" />,
    },
    {
      title: "운영 · 광고 지원",
      description: "사이트 론칭 이후 검색 등록 대행 및 다양한 SNS 광고 채널 연동을 원활히 지원합니다.",
      icon: <CheckSquare className="h-6 w-6 text-red-500" />,
    },
  ];

  const steps = [
    { number: "01", title: "고객 의뢰 및 접수", desc: "업종 및 기획 미팅 진행" },
    { number: "02", title: "협의 후 제작 완료", desc: "3~7일 내 최적화 개발" },
    { number: "03", title: "로켓 배송 완료", desc: "도메인 연결 및 검수 완료" },
    { number: "04", title: "광고 및 사후 관리", desc: "검색 등록 및 광고 연동 지원" },
  ];

  return (
    <section className="w-full py-16 px-4 md:py-24 md:px-8 bg-gray-50/50 dark:bg-gray-950/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
            WEFLOW만의 <span className="text-blue-600 dark:text-blue-400">케어 플랜 혜택</span>
          </h2>
          <p className="mt-4 text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            단순히 템플릿에 텍스트만 넣는 외주가 아닌, <br /> 비즈니스 타겟 맞춤 고객 유치 동선과 관리 플랜을 제공합니다.
          </p>
        </div>

        {/* 6 Grid Box */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200/50 bg-white/70 p-6 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md dark:border-gray-700 dark:bg-[#030712]/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-900">
                {benefit.icon}
              </div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white mb-2">{benefit.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Process Flow Timeline */}
        <div className="mt-20 rounded-2xl border border-blue-500/10 bg-blue-50/10 p-6 dark:border-blue-900/50 dark:bg-blue-950/5 md:p-10">
          <h3 className="text-center text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-10">
            WEFLOW 통합 진행 프로세스
          </h3>

          {/* Desktop Steps (Horizontal) */}
          <div className="hidden md:flex items-center justify-between gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 flex items-center relative">
                <div className="flex flex-col items-center text-center w-full px-2 z-10">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">{step.number}</span>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{step.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute right-[-10%] top-[40%] translate-y-[-50%] text-blue-500/40">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Steps (Vertical) */}
          <div className="flex md:hidden flex-col items-center gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{step.number}</span>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mt-1 mb-1">{step.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <ArrowDown className="h-4 w-4 text-blue-500/40 mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
