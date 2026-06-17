# WEFLOW

> 문의로 이어지는 홈페이지 제작 · 광고 운영 · 검색 상단 노출 — 웹 마케팅 솔루션 랜딩 사이트

단순 제작을 넘어 **문의 구조 설계와 검색 노출 전략**까지 제공하는 웹 에이전시(WEFLOW)의 공식 웹사이트입니다. Next.js 14 App Router 기반으로 제작되었으며, 인터랙티브 WebGL 히어로, 다크/라이트 테마, Supabase 백엔드 연동 문의·예약 수집, 관리자 대시보드를 갖추고 있습니다.

🔗 **데모:** https://weflow-ebon.vercel.app/

<p>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white" />
</p>

---

## ✨ 주요 기능

- **인터랙티브 WebGL 히어로** — 마우스/터치에 반응하는 실시간 유체 시뮬레이션(GPU 셰이더, Navier–Stokes 기반). 화면 밖이거나 탭이 비활성이면 자동으로 렌더링을 멈추고, `prefers-reduced-motion`을 존중합니다.
- **다크 / 라이트 테마** — `localStorage` 기억 + 시스템 설정 감지, View Transitions API를 활용한 원형 전환 애니메이션.
- **무료 진단 & 예약 폼** — 사용자가 제출한 문의/예약이 **Supabase**에 저장됩니다.
- **관리자 대시보드** (`/admin`) — Supabase Auth 로그인, 문의·예약 목록 관리, 상태 변경, **엑셀(xlsx) 내보내기**, 비밀번호 재설정/계정 삭제.
- **업종별 성공 사례 & 고객 후기** — Swiper 캐러셀, 무한 마퀴 애니메이션.
- **완전 반응형 UI** — 모바일/데스크톱 레이아웃 분기, 하단 플로팅 퀵바(전화·카톡·블로그·진단).
- **SEO 최적화** — 메타데이터, 키워드, 오픈그래프 아이콘 구성.

## 🛠️ 기술 스택

| 분류 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 14 (App Router), React 18 |
| 언어 | TypeScript 5 |
| 스타일 | Tailwind CSS 3 |
| 백엔드 / 인증 | Supabase (`@supabase/supabase-js`) |
| UI / 인터랙션 | lucide-react(아이콘), Swiper(캐러셀), WebGL(유체 셰이더) |
| 데이터 | xlsx(엑셀 내보내기), sharp(이미지 최적화) |
| 배포 | Vercel |

## 📁 프로젝트 구조

```
src/
├── app/                  # App Router 페이지
│   ├── page.tsx          # 메인(홈)
│   ├── service/          # 서비스 소개
│   ├── pricing/          # 제작 플랜 & 가격
│   ├── cases/            # 성공 사례 (목록 + [slug] 상세)
│   ├── diagnosis/        # 무료 진단 신청 폼
│   ├── reservation/      # 예약 폼
│   ├── admin/            # 관리자 대시보드 + 비밀번호 재설정
│   ├── api/admin/delete/ # 계정 삭제 API (service_role, 서버 전용)
│   ├── privacy / terms/  # 개인정보처리방침 · 이용약관
│   └── layout.tsx        # 루트 레이아웃 / 테마 프로바이더
├── components/           # Navbar, HeroSection, Footer, CasesSection 등
└── lib/                  # supabase, storage, theme-context, 데이터/타입
```

## 🚀 시작하기

### 1. 설치

```bash
git clone https://github.com/K777agent/weflow.git
cd weflow
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 채워 넣습니다. (Supabase 프로젝트의 **Settings → API** 에서 확인)

```bash
# 클라이언트(브라우저)에서 사용 — 공개되어도 되는 anon 키
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# 서버 전용 — 절대 클라이언트에 노출 금지 (관리자 계정 삭제 API에서 사용)
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

> ⚠️ `.env.local` 은 `.gitignore` 에 포함되어 커밋되지 않습니다. `service_role` 키는 서버 라우트에서만 사용되며 브라우저로 노출되지 않도록 주의하세요.

Supabase 측에는 `reservations`, `inquiries` 테이블과, 공개 폼이 `anon` 권한으로 INSERT 만 가능하도록 하는 RLS 정책이 필요합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 에서 확인합니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

## ☁️ 배포

Vercel에 연결하면 자동 배포됩니다. Vercel 프로젝트의 **Settings → Environment Variables** 에 위 환경 변수 3개를 동일하게 등록하세요.

---

> 본 저장소는 포트폴리오 / 코드 소개 목적으로 공개되었습니다. 디자인·콘텐츠의 상업적 무단 사용은 삼가주세요.
