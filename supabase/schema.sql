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

-- 예약: 공개 직접 INSERT 정책은 제거합니다.
--   슬롯당 최대 2명 제한을 강제하기 위해, 공개 폼은 아래 create_reservation()
--   함수(RPC)를 통해서만 예약을 넣을 수 있도록 합니다.
drop policy if exists "reservations_public_insert" on public.reservations;

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
-- 예약 슬롯 제한 함수
--   같은 날짜(date) + 같은 시간(time) 에는 최대 2명까지만 예약 가능.
--   공개 폼(anon)은 SELECT 권한이 없으므로, security definer 함수로
--   "조회 후 삽입"을 원자적으로 처리합니다.
-- =====================================================================

-- 공개 폼 전용: 슬롯 정원(2명) 확인 후 예약 삽입
create or replace function public.create_reservation(
  p_name                text,
  p_phone               text,
  p_date                text,
  p_time                text,
  p_type                text,
  p_industry            text,
  p_additional_requests text,
  p_privacy_consent     boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  slot_count int;
begin
  -- 동일 슬롯 동시 예약 경합 방지 (트랜잭션 단위 잠금)
  perform pg_advisory_xact_lock(hashtext(p_date || ' ' || p_time));

  select count(*) into slot_count
  from public.reservations
  where date = p_date and time = p_time;

  if slot_count >= 2 then
    raise exception 'SLOT_FULL';
  end if;

  insert into public.reservations(
    name, phone, date, time, type, industry, additional_requests, privacy_consent
  ) values (
    p_name, p_phone, p_date, p_time, p_type, p_industry, p_additional_requests, p_privacy_consent
  );
end;
$$;

grant execute on function public.create_reservation(
  text, text, text, text, text, text, text, boolean
) to anon, authenticated;

-- 공개 폼 전용: 특정 날짜의 시간대별 예약 인원수 (마감 슬롯 비활성화 표시용)
create or replace function public.reservation_slot_counts(p_date text)
returns table(slot_time text, cnt bigint)
language sql
security definer
set search_path = public
as $$
  select time as slot_time, count(*) as cnt
  from public.reservations
  where date = p_date
  group by time;
$$;

grant execute on function public.reservation_slot_counts(text) to anon, authenticated;

-- =====================================================================
-- 참고: 관리자 계정은 1개만 사용합니다.
--   Supabase 대시보드 → Authentication → Users → "Add user" 로
--   junzang00@gmail.com 계정을 직접 만든 뒤,
--   Authentication → Providers → Email 에서 "Allow new users to sign up"
--   옵션을 꺼 두면 그 외 가입을 막을 수 있습니다.
-- =====================================================================
