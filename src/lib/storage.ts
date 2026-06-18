import { Reservation, Inquiry, CaseStudy } from "./types";
import { casesData } from "./cases-data";
import { supabase } from "./supabase";

// Cases는 프로토타입 단계에서 기존 localStorage 방식 유지 (공개 cases 페이지 호환).
// 예약(reservations) / 문의(inquiries) 는 Supabase 백엔드로 동작합니다.
const KEYS = {
  CASES: "weflow_cases",
};

const isClient = typeof window !== "undefined";

// timestamptz(ISO) → "YYYY-MM-DD HH:mm:ss" 로 변환 (관리자 화면/엑셀 표시용)
const formatCreatedAt = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
};

// 동일 윈도우 내 실시간 갱신을 위한 커스텀 이벤트
const notifyDataChanged = () => {
  if (isClient) window.dispatchEvent(new Event("weflow_data_changed"));
};

// DB(snake_case) → 앱 타입(camelCase) 매핑
/* eslint-disable @typescript-eslint/no-explicit-any */
const mapReservation = (row: any): Reservation => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  date: row.date,
  time: row.time,
  type: row.type,
  industry: row.industry,
  additionalRequests: row.additional_requests ?? "",
  privacyConsent: !!row.privacy_consent,
  status: row.status,
  createdAt: formatCreatedAt(row.created_at),
});

const mapInquiry = (row: any): Inquiry => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  type: row.type,
  industry: row.industry,
  additionalRequests: row.additional_requests ?? "",
  privacyConsent: !!row.privacy_consent,
  status: row.status,
  createdAt: formatCreatedAt(row.created_at),
});
/* eslint-enable @typescript-eslint/no-explicit-any */

// ----------------- Reservations (Supabase) -----------------
export const getReservations = async (): Promise<Reservation[]> => {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getReservations]", error.message);
    return [];
  }
  return (data ?? []).map(mapReservation);
};

export const addReservation = async (
  input: Omit<Reservation, "id" | "status" | "createdAt">
): Promise<void> => {
  // 공개 폼은 create_reservation() RPC 를 통해서만 예약을 넣습니다.
  // (슬롯당 최대 2명 제한을 DB 에서 원자적으로 강제 — anon 직접 INSERT 정책 없음)
  const { error } = await supabase.rpc("create_reservation", {
    p_name: input.name,
    p_phone: input.phone,
    p_date: input.date,
    p_time: input.time,
    p_type: input.type,
    p_industry: input.industry,
    p_additional_requests: input.additionalRequests,
    p_privacy_consent: input.privacyConsent,
  });
  if (error) {
    if (error.message.includes("SLOT_FULL")) {
      throw new Error("선택하신 날짜·시간대의 예약이 마감되었습니다. 다른 시간을 선택해 주세요.");
    }
    console.error("[addReservation]", error.message);
    throw new Error("예약 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }
  notifyDataChanged();
};

// 특정 날짜의 시간대별 예약 인원수 (마감 슬롯 비활성화 표시용)
export const getReservationSlotCounts = async (
  date: string
): Promise<Record<string, number>> => {
  const { data, error } = await supabase.rpc("reservation_slot_counts", { p_date: date });
  if (error) {
    console.error("[getReservationSlotCounts]", error.message);
    return {};
  }
  const map: Record<string, number> = {};
  (data ?? []).forEach((row: { slot_time: string; cnt: number }) => {
    map[row.slot_time] = Number(row.cnt);
  });
  return map;
};

export const updateReservationStatus = async (
  id: string,
  status: Reservation["status"]
): Promise<void> => {
  const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
  if (error) {
    console.error("[updateReservationStatus]", error.message);
    return;
  }
  notifyDataChanged();
};

export const deleteReservation = async (id: string): Promise<void> => {
  const { error } = await supabase.from("reservations").delete().eq("id", id);
  if (error) {
    console.error("[deleteReservation]", error.message);
    return;
  }
  notifyDataChanged();
};

// ----------------- Inquiries (Supabase) -----------------
export const getInquiries = async (): Promise<Inquiry[]> => {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getInquiries]", error.message);
    return [];
  }
  return (data ?? []).map(mapInquiry);
};

export const addInquiry = async (
  input: Omit<Inquiry, "id" | "status" | "createdAt">
): Promise<void> => {
  // 공개 폼은 anon 권한으로 INSERT 만 수행합니다.
  const { error } = await supabase.from("inquiries").insert({
    name: input.name,
    phone: input.phone,
    type: input.type,
    industry: input.industry,
    additional_requests: input.additionalRequests,
    privacy_consent: input.privacyConsent,
  });
  if (error) {
    console.error("[addInquiry]", error.message);
    throw new Error("문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  }
  notifyDataChanged();
};

export const updateInquiryStatus = async (
  id: string,
  status: Inquiry["status"]
): Promise<void> => {
  const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
  if (error) {
    console.error("[updateInquiryStatus]", error.message);
    return;
  }
  notifyDataChanged();
};

export const deleteInquiry = async (id: string): Promise<void> => {
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) {
    console.error("[deleteInquiry]", error.message);
    return;
  }
  notifyDataChanged();
};

// ----------------- Cases (localStorage, 프로토타입 유지) -----------------
export const getCases = (): CaseStudy[] => {
  if (!isClient) return casesData;
  const stored = localStorage.getItem(KEYS.CASES);
  if (!stored) {
    localStorage.setItem(KEYS.CASES, JSON.stringify(casesData));
    return casesData;
  }
  return JSON.parse(stored);
};

export const saveCases = (list: CaseStudy[]) => {
  if (!isClient) return;
  localStorage.setItem(KEYS.CASES, JSON.stringify(list));
  window.dispatchEvent(new Event("weflow_cases_changed"));
};

export const updateCase = (slug: string, updatedFields: Partial<CaseStudy>) => {
  const list = getCases();
  const updated = list.map((item) => (item.slug === slug ? { ...item, ...updatedFields } : item));
  saveCases(updated);
};

export const addCase = (newCase: CaseStudy) => {
  const list = getCases();
  if (list.some((item) => item.slug === newCase.slug)) {
    throw new Error("이미 존재하는 슬러그(Slug)입니다.");
  }
  list.unshift(newCase);
  saveCases(list);
};

export const deleteCase = (slug: string) => {
  const list = getCases();
  const filtered = list.filter((item) => item.slug !== slug);
  saveCases(filtered);
};

export const resetCases = () => {
  if (!isClient) return;
  localStorage.setItem(KEYS.CASES, JSON.stringify(casesData));
  window.dispatchEvent(new Event("weflow_cases_changed"));
};
