-- =====================================================================
-- WEFLOW 백엔드 스키마 (Supabase / Postgres)
-- 사용법: Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- =====================================================================

-- ----------------------------- 예약 -----------------------------------
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  date text not null,                 -- 희망 날짜 (YYYY-MM-DD)
  time text not null,                 -- 희망 시간 (HH:mm)
  type text not null,                 -- 제작 종류
  industry text not null,
  additional_requests text,
  privacy_consent boolean not null default false,
  status text not null default '대기',  -- 대기 / 진행중 / 완료
  created_at timestamptz not null default now()
);

-- ----------------------------- 문의(진단) ------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  type text not null,                 -- 진단/제작 종류
  industry text not null,
  additional_requests text,
  privacy_consent boolean not null default false,
  status text not null default '대기',
  created_at timestamptz not null default now()
);

-- =====================================================================
-- RLS (Row Level Security) 정책
--  - 공개 폼: 누구나(anon) INSERT 가능
--  - 관리자(authenticated): 전체 조회/수정/삭제 가능
-- =====================================================================
alter table public.reservations enable row level security;
alter table public.inquiries   enable row level security;

-- 예약: 공개 INSERT
drop policy if exists "reservations_public_insert" on public.reservations;
create policy "reservations_public_insert"
  on public.reservations for insert
  to anon, authenticated
  with check (true);

-- 예약: 관리자 전체 권한 (조회/수정/삭제)
drop policy if exists "reservations_admin_all" on public.reservations;
create policy "reservations_admin_all"
  on public.reservations for all
  to authenticated
  using (true)
  with check (true);

-- 문의: 공개 INSERT
drop policy if exists "inquiries_public_insert" on public.inquiries;
create policy "inquiries_public_insert"
  on public.inquiries for insert
  to anon, authenticated
  with check (true);

-- 문의: 관리자 전체 권한
drop policy if exists "inquiries_admin_all" on public.inquiries;
create policy "inquiries_admin_all"
  on public.inquiries for all
  to authenticated
  using (true)
  with check (true);

-- =====================================================================
-- 참고: 관리자 계정은 1개만 사용합니다.
--   Supabase 대시보드 → Authentication → Users → "Add user" 로
--   junzang00@gmail.com 계정을 직접 만든 뒤,
--   Authentication → Providers → Email 에서 "Allow new users to sign up"
--   옵션을 꺼 두면 그 외 가입을 막을 수 있습니다.
-- =====================================================================
