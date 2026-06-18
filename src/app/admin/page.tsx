"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import {
  getReservations, 
  updateReservationStatus, 
  deleteReservation,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getCases,
  addCase,
  updateCase,
  deleteCase
} from "@/lib/storage";
import { Reservation, Inquiry, CaseStudy } from "@/lib/types";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  RotateCw, 
  Download, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  Search, 
  Lock, 
  Mail,
  Edit2,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function AdminPage() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  // Authentication states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  // Password Recovery States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryName, setRecoveryName] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [showTempPwModal, setShowTempPwModal] = useState(false);

  // Account Popover & Modal States
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  // Reset Password States
  const [resetCurrentPw, setResetCurrentPw] = useState("");
  const [resetNewPw, setResetNewPw] = useState("");
  const [resetConfirmPw, setResetConfirmPw] = useState("");
  const [resetPwError, setResetPwError] = useState("");

  // Mobile navigation state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data states
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [cases, setCases] = useState<CaseStudy[]>([]);

  // UI state
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "reservations" | "inquiries">("dashboard");
  const [statusFilter, setStatusFilter] = useState<"전체" | "대기" | "진행중" | "완료">("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Case study modal states
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [caseForm, setCaseForm] = useState<CaseStudy>({
    slug: "",
    title: "",
    category: "스포츠/헬스",
    image: "/images/cases/cases_pt.jpg",
    conversionRate: "",
    details: "",
  });
  const [caseModalError, setCaseModalError] = useState("");

  // Initial Load & Auth Check (Supabase 세션 기반)
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
      setAdminEmail(data.session?.user.email ?? "");
      setAuthLoading(false);
    };
    init();

    // 로그인/로그아웃 등 세션 변화 감지
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setAdminEmail(session?.user.email ?? "");
    });

    // 같은 브라우저 내 데이터 변경 동기화
    const syncData = () => {
      loadData();
    };
    window.addEventListener("weflow_data_changed", syncData);
    window.addEventListener("weflow_cases_changed", syncData);
    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("weflow_data_changed", syncData);
      window.removeEventListener("weflow_cases_changed", syncData);
    };
  }, []);

  // 로그인 상태가 되면 데이터를 불러옵니다 (RLS상 인증 필요).
  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    } else {
      setReservations([]);
      setInquiries([]);
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    const [res, inq] = await Promise.all([getReservations(), getInquiries()]);
    setReservations(res);
    setInquiries(inq);
    setCases(getCases());
  };

  // Auth Submit (Supabase Auth)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmittingAuth(false);
    if (error) {
      setAuthError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }
    setAuthError("");
    setPassword("");
    setIsLoggedIn(true);
  };

  // 비밀번호 찾기: 본인 이메일로 재설정 링크 발송
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAuth(true);
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/admin/reset-password` : undefined;
    // 보안상, 가입 여부와 무관하게 동일한 안내를 보여줍니다.
    await supabase.auth.resetPasswordForEmail(recoveryEmail, { redirectTo });
    setIsSubmittingAuth(false);
    setShowTempPwModal(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  // 계정 삭제: 서버 라우트(service_role) 호출 → 로그아웃 → 메인으로 이동
  const handleDeleteAccount = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
      setIsDeleteAccountModalOpen(false);
      setIsLoggedIn(false);
      return;
    }
    const res = await fetch("/api/admin/delete", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error || "계정 삭제에 실패했습니다.");
      return;
    }
    await supabase.auth.signOut();
    setIsDeleteAccountModalOpen(false);
    alert("계정이 삭제되었습니다. 메인 페이지로 이동합니다.");
    router.push("/");
  };

  // Toggle detail rows
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter lists based on status filter and search query
  const filteredReservations = reservations.filter((item) => {
    const matchesStatus = statusFilter === "전체" || item.status === statusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.phone.includes(searchQuery) ||
                          item.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredInquiries = inquiries.filter((item) => {
    const matchesStatus = statusFilter === "전체" || item.status === statusFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.phone.includes(searchQuery) ||
                          item.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalReservations = reservations.length;
  const totalInquiries = inquiries.length;
  
  // activeMenu에 따라 전체 유입 수(totalInflow) 계산 분기
  const totalInflow = activeMenu === "reservations"
    ? totalReservations
    : activeMenu === "inquiries"
    ? totalInquiries
    : totalReservations + totalInquiries;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayReservations = reservations.filter(item => item.createdAt.startsWith(todayStr)).length;
  const todayInquiries = inquiries.filter(item => item.createdAt.startsWith(todayStr)).length;
  const todayInflow = todayReservations + todayInquiries;

  const countByStatus = (status: "대기" | "진행중" | "완료") => {
    const resCount = reservations.filter((item) => item.status === status).length;
    const inqCount = inquiries.filter((item) => item.status === status).length;
    if (activeMenu === "reservations") {
      return resCount;
    }
    if (activeMenu === "inquiries") {
      return inqCount;
    }
    return resCount + inqCount;
  };

  const waitCount = countByStatus("대기");
  const progressCount = countByStatus("진행중");
  const completedCount = countByStatus("완료");
  const completionRate = totalInflow > 0 ? Math.round((completedCount / totalInflow) * 100) : 0;

  // Excel File Download using SheetJS (xlsx) for modern multi-sheet support
  const handleDownloadAll = () => {
    const resData = reservations.map((item) => ({
      상태: item.status,
      이름: item.name,
      연락처: item.phone,
      접수일시: item.createdAt,
      희망일정: `${item.date} ${item.time}`,
      제작종류: item.type,
      업종: item.industry,
      추가요청사항: item.additionalRequests,
    }));

    const inqData = inquiries.map((item) => ({
      상태: item.status,
      이름: item.name,
      연락처: item.phone,
      접수일시: item.createdAt,
      제작종류: item.type,
      업종: item.industry,
      추가요청사항: item.additionalRequests,
    }));

    const wb = XLSX.utils.book_new();
    const wsRes = XLSX.utils.json_to_sheet(resData);
    const wsInq = XLSX.utils.json_to_sheet(inqData);

    XLSX.utils.book_append_sheet(wb, wsRes, "예약 신청 목록");
    XLSX.utils.book_append_sheet(wb, wsInq, "진단 문의 목록");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `위플로우_전체_접수_대장_${today}.xlsx`);
  };

  const handleDownloadReservations = () => {
    const data = reservations.map((item) => ({
      상태: item.status,
      이름: item.name,
      연락처: item.phone,
      접수일시: item.createdAt,
      희망일정: `${item.date} ${item.time}`,
      제작종류: item.type,
      업종: item.industry,
      추가요청사항: item.additionalRequests,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "예약 신청 목록");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `위플로우_예약_관리_대장_${today}.xlsx`);
  };

  const handleDownloadInquiries = () => {
    const data = inquiries.map((item) => ({
      상태: item.status,
      이름: item.name,
      연락처: item.phone,
      접수일시: item.createdAt,
      제작종류: item.type,
      업종: item.industry,
      추가요청사항: item.additionalRequests,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "진단 문의 목록");

    const today = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `위플로우_문의_관리_대장_${today}.xlsx`);
  };

  // Case Study Actions
  const handleOpenCaseModal = (caseItem?: CaseStudy) => {
    if (caseItem) {
      setEditingCase(caseItem);
      setCaseForm({ ...caseItem });
    } else {
      setEditingCase(null);
      setCaseForm({
        slug: "",
        title: "",
        category: "스포츠/헬스",
        image: "/images/cases/cases_pt.jpg",
        conversionRate: "",
        details: "",
      });
    }
    setCaseModalError("");
    setIsCaseModalOpen(true);
  };

  const handleSaveCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseForm.slug.trim()) return setCaseModalError("슬러그(Slug)를 입력해 주세요.");
    if (!caseForm.title.trim()) return setCaseModalError("브랜드명을 입력해 주세요.");
    if (!caseForm.details.trim()) return setCaseModalError("설명을 입력해 주세요.");

    try {
      if (editingCase) {
        updateCase(editingCase.slug, caseForm);
      } else {
        addCase(caseForm);
      }
      setIsCaseModalOpen(false);
      loadData();
    } catch (err: unknown) {
      setCaseModalError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  };

  const handleDeleteCase = (slug: string) => {
    if (confirm("정말 이 성공 사례를 삭제하시겠습니까?")) {
      deleteCase(slug);
      loadData();
    }
  };

  // 세션 확인 중에는 화면 깜빡임 방지를 위해 로딩 표시
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        <div className="flex flex-col items-center gap-3">
          <RotateCw className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-xs text-gray-400">로딩 중...</span>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] px-4 py-12 text-white">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-800 bg-gray-950/40 p-8 shadow-2xl backdrop-blur-md">
          {/* Decorative glow */}
          <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl"></div>
          <div className="absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl"></div>

          <div className="text-center mb-8 relative">
            <h1 className="text-2xl font-black tracking-tight text-white">
              WEFLOW <span className="text-blue-500">ADMIN</span>
            </h1>
            <p className="mt-2 text-xs text-gray-400">
              {isForgotPassword ? "비밀번호 재설정 (본인 인증)" : "위플로우 관리자 대시보드 로그인"}
            </p>
          </div>

          {isForgotPassword ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5 relative">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">관리자 이름</label>
                <input
                  type="text"
                  required
                  placeholder="예: 김준장"
                  value={recoveryName}
                  onChange={(e) => setRecoveryName(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-3 px-4 text-xs text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">휴대전화 번호</label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  value={recoveryPhone}
                  onChange={(e) => setRecoveryPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-3 px-4 text-xs text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">이메일 계정</label>
                <input
                  type="email"
                  required
                  placeholder="junzang00@gmail.com"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-3 px-4 text-xs text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
              >
                {isSubmittingAuth ? "메일 전송 중..." : "본인 인증 및 재설정 메일 발송"}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-xs text-gray-400 hover:text-white transition-all underline underline-offset-4"
                >
                  로그인 화면으로 돌아가기
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5 relative">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">이메일 계정</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-3 pl-10 pr-4 text-xs text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">비밀번호</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-3 pl-10 pr-4 text-xs text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {authError && (
                <div className="space-y-2 text-center animate-in fade-in-50 duration-200">
                  <p className="text-[11px] font-bold text-red-500">
                    {authError}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryEmail(email);
                      setIsForgotPassword(true);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-extrabold underline underline-offset-4 mt-1 inline-block"
                  >
                    비밀번호를 잊어버리셨나요? (재설정 메일 발송)
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
              >
                {isSubmittingAuth ? "로그인 중..." : "대시보드 로그인"}
              </button>

              {!authError && (
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-[11px] text-gray-400 hover:text-white transition-all underline underline-offset-4"
                  >
                    비밀번호 재설정
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Temporary Password Modal Popup */}
        {showTempPwModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50 duration-200">
            <div className="relative w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-950 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-white mb-2">재설정 메일을 발송했습니다</h3>
              <p className="text-xs text-gray-400 mb-5 leading-relaxed">
                입력하신 이메일({recoveryEmail || "관리자 이메일"})로<br />
                비밀번호 재설정 링크를 보냈습니다.<br />
                메일의 링크를 눌러 새 비밀번호를 설정해 주세요.<br />
                <span className="text-gray-500">(메일이 보이지 않으면 스팸함도 확인해 주세요.)</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowTempPwModal(false);
                  setIsForgotPassword(false);
                }}
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-all"
              >
                로그인 화면으로 이동
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

    return (
    <div className="flex h-screen overflow-hidden bg-gray-55 dark:bg-gray-900 text-gray-850 dark:text-gray-250 transition-colors">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-[75] bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* 1. Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[80] w-64 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col overflow-hidden transition-transform duration-300
        md:sticky md:top-0 md:translate-x-0 md:flex-shrink-0
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <span className="text-lg font-black tracking-tight flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-extrabold">W</span>
            WEFLOW <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40">ADMIN</span>
          </span>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => { setActiveMenu("dashboard"); setStatusFilter("전체"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
              activeMenu === "dashboard"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            전체 대시보드 현황
          </button>
          <button
            onClick={() => { setActiveMenu("reservations"); setStatusFilter("전체"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
              activeMenu === "reservations"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            }`}
          >
            <Calendar className="h-4 w-4" />
            예약 관리
          </button>
          <button
            onClick={() => { setActiveMenu("inquiries"); setStatusFilter("전체"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
              activeMenu === "inquiries"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            문의 관리
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 relative space-y-3">
          {/* Account Context Popover Menu Container */}
          <div className="relative">
            {isAccountMenuOpen && (
              <div className="absolute bottom-[105%] left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-2 z-[90] animate-in slide-in-from-bottom-2 duration-150 mb-2">
                <div className="px-3 py-1.5 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-[9px] font-bold text-gray-450">계정 설정</p>
                </div>
                <button
                  onClick={() => {
                    setIsResetPasswordModalOpen(true);
                    setIsAccountMenuOpen(false);
                    setResetPwError("");
                    setResetCurrentPw("");
                    setResetNewPw("");
                    setResetConfirmPw("");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60 transition-colors text-left"
                >
                  <Lock className="h-3.5 w-3.5 text-blue-500" />
                  비밀번호 재설정
                </button>
                <button
                  onClick={() => {
                    setIsDeleteAccountModalOpen(true);
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-colors text-left"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  계정 정보 삭제
                </button>
              </div>
            )}

            {/* Account Card (Trigger) */}
            <div 
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-150 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/20 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800/40 select-none ${isAccountMenuOpen ? 'ring-2 ring-blue-500/50' : ''}`}
            >
              <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-blue-500/10 uppercase">
                {(adminEmail || "AD").slice(0, 2)}
              </div>
              <div className="truncate flex-1">
                <span className="block text-[10px] font-black leading-none truncate">{adminEmail ? adminEmail.split("@")[0] : "관리자"}</span>
                <span className="block text-[8px] text-gray-400 truncate mt-0.5">{adminEmail || "-"}</span>
              </div>
              <ChevronUp className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:text-red-750 dark:border-red-800/80 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 dark:hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* 2. Main Area */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto space-y-4 sm:space-y-6">
        
        {/* Top bar control panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-850">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-350 hover:bg-gray-55 dark:hover:bg-gray-850 transition-all shadow-sm"
              title="메뉴 열기"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                {activeMenu === "dashboard" && "전체 대시보드"}
                {activeMenu === "reservations" && "예약 관리 패널"}
                {activeMenu === "inquiries" && "진단 문의 관리 패널"}
              </h2>
              <p className="hidden sm:block text-xs text-gray-400 mt-0.5">상태 필터링, 실시간 변경, 엑셀 출력 및 성공 사례를 편집합니다.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full md:w-auto pb-1 shrink-0">
            <button
              onClick={() => handleOpenCaseModal()}
              className="flex items-center gap-1 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-98"
            >
              <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              CASE 수정
            </button>
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1 shrink-0 rounded-xl border border-gray-200 bg-white px-2.5 py-2 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs font-bold text-gray-700 hover:bg-gray-55 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              전체 엑셀 다운로드
            </button>
            <button
              onClick={loadData}
              className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-55 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
              title="새로고침"
            >
              <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-55 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
              title="화이트/다크 모드 전환"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
          </div>
        </div>

        {/* 6 Grid Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">예약 신청</span>
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <span className="text-xl font-black">{totalReservations}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">누적 예약 신청</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">진단 문의</span>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <span className="text-xl font-black">{totalInquiries}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">누적 문의 접수</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">오늘 유입</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <span className="text-xl font-black text-green-500">{todayInflow}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">신규 접수 건수</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">대기 건수</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <span className="text-xl font-black text-amber-500">{waitCount}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">대기 상담 접수</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">진행중 건수</span>
              <RotateCw className="h-4 w-4 text-indigo-500 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-black text-indigo-500">{progressCount}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">진행 중 상담 건</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/50 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">완료 전환율</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <span className="text-xl font-black text-emerald-500">{completionRate}%</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">상담 완료 비중</span>
            </div>
          </div>
        </div>

        {/* Realtime Statistics Chart (Premium custom SVG illustration) */}
        {activeMenu === "dashboard" && (
          <div className="rounded-3xl border border-gray-200/50 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">접수 데이터 비율 및 누적 분석</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Doughnut Chart representation via SVG */}
              <div className="flex flex-row items-center justify-center gap-4 sm:gap-6 p-2 sm:p-4 w-full">
                <div className="relative h-28 w-28 sm:h-40 sm:w-40 shrink-0">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="transparent" className="dark:stroke-gray-800" />
                    {totalInflow > 0 ? (
                      <>
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#3b82f6"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={`${(totalReservations / totalInflow) * 251.2} 251.2`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#ec4899"
                          strokeWidth="12"
                          fill="transparent"
                          strokeDasharray={`${(totalInquiries / totalInflow) * 251.2} 251.2`}
                          strokeDashoffset={`-${(totalReservations / totalInflow) * 251.2}`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </>
                    ) : null}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg sm:text-2xl font-black">{totalInflow}</span>
                    <span className="text-[8px] sm:text-[9px] text-gray-400">총 유입</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded bg-blue-500 shrink-0"></span>
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300 block whitespace-nowrap">상담 예약 신청</span>
                      <span className="text-[11px] sm:text-xs font-black whitespace-nowrap">{totalReservations}건 ({totalInflow > 0 ? Math.round((totalReservations / totalInflow) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded bg-pink-500 shrink-0"></span>
                    <div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-gray-700 dark:text-gray-300 block whitespace-nowrap">무료 견적/진단 문의</span>
                      <span className="text-[11px] sm:text-xs font-black whitespace-nowrap">{totalInquiries}건 ({totalInflow > 0 ? Math.round((totalInquiries / totalInflow) * 100) : 0}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress visual representation by status */}
              <div className="space-y-4 p-4 border-l border-gray-150 dark:border-gray-800">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span>대기 접수</span>
                    <span>{waitCount}건 ({totalInflow > 0 ? Math.round((waitCount / totalInflow) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded transition-all duration-700" 
                      style={{ width: `${totalInflow > 0 ? (waitCount / totalInflow) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500"></span>진행중 상담</span>
                    <span>{progressCount}건 ({totalInflow > 0 ? Math.round((progressCount / totalInflow) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded transition-all duration-700" 
                      style={{ width: `${totalInflow > 0 ? (progressCount / totalInflow) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span>완료 건수</span>
                    <span>{completedCount}건 ({totalInflow > 0 ? Math.round((completedCount / totalInflow) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded transition-all duration-700" 
                      style={{ width: `${totalInflow > 0 ? (completedCount / totalInflow) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tab buttons & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit">
            {(["전체", "대기", "진행중", "완료"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  statusFilter === tab
                    ? "bg-white text-gray-900 dark:bg-gray-800 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                {tab} {statusFilter === tab ? "" : `(${tab === "전체" ? totalInflow : tab === "대기" ? waitCount : tab === "진행중" ? progressCount : completedCount})`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="고객명, 연락처, 업종 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50"
            />
          </div>
        </div>

        {/* [A] Reservations Management Table */}
        {(activeMenu === "dashboard" || activeMenu === "reservations") && (
          <div className="rounded-3xl border border-gray-200/50 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="px-3.5 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-850 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-black flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                예약 신청 목록 ({filteredReservations.length}건)
              </h3>
              <button
                onClick={handleDownloadReservations}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-55 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
              >
                <Download className="h-3 w-3" />
                예약 관리 다운 엑셀파일
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-55/50 border-b border-gray-150 text-gray-400 dark:bg-gray-900/10 dark:border-gray-850">
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap">상태</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap">이름</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap hidden md:table-cell">연락처</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap hidden md:table-cell">접수일</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap hidden md:table-cell">희망 일정</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold text-center whitespace-nowrap">관리</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold text-center whitespace-nowrap">상세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((item) => {
                      const isExpanded = !!expandedRows[item.id];
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-gray-55/35 dark:hover:bg-gray-900/5 transition-colors">
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 whitespace-nowrap">
                              <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-extrabold whitespace-nowrap ${
                                item.status === "대기" 
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                  : item.status === "진행중"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 font-bold whitespace-nowrap">{item.name}</td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 font-mono whitespace-nowrap hidden md:table-cell">{item.phone}</td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 text-gray-400 whitespace-nowrap hidden md:table-cell">{item.createdAt.split(" ")[0]}</td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap hidden md:table-cell">
                              {item.date} / {item.time}
                            </td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 text-center">
                              <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                                <button
                                  onClick={() => updateReservationStatus(item.id, "진행중")}
                                  className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/45 text-[9px] sm:text-[10px] font-bold whitespace-nowrap"
                                >
                                  진행<span className="hidden sm:inline">중</span>
                                </button>
                                <button
                                  onClick={() => updateReservationStatus(item.id, "완료")}
                                  className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/45 text-[9px] sm:text-[10px] font-bold whitespace-nowrap"
                                >
                                  완료
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("정말 이 예약을 삭제하시겠습니까?")) deleteReservation(item.id);
                                  }}
                                  className="p-1 rounded hover:bg-red-50 text-red-500 dark:hover:bg-red-950/20 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 text-center">
                              <button
                                onClick={() => toggleRow(item.id)}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-gray-55 dark:bg-gray-900/30">
                              <td colSpan={7} className="p-4 md:p-5 border-t border-b border-gray-150 dark:border-gray-850">
                                <div className="flex flex-col gap-4 md:gap-6 animate-in slide-in-from-top-2 duration-150">
                                  {/* Mobile Only Info Card */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden border-b border-gray-200 dark:border-gray-800 pb-3">
                                    <div>
                                      <span className="block text-[10px] font-bold text-gray-455 mb-0.5">연락처</span>
                                      <span className="text-xs font-mono text-gray-800 dark:text-gray-200">{item.phone}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[10px] font-bold text-gray-455 mb-0.5">접수일</span>
                                      <span className="text-xs text-gray-800 dark:text-gray-200">{item.createdAt}</span>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                      <span className="block text-[10px] font-bold text-gray-455 mb-0.5">희망 일정</span>
                                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.date} / {item.time}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                    <div className="flex-1">
                                      <span className="block text-[10px] font-bold text-gray-455 mb-1">업종 및 직무</span>
                                      <span className="text-xs font-black text-gray-600 dark:text-gray-250 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200/60 dark:border-gray-800">{item.industry}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] font-bold text-gray-455 mb-1">남기신 문의사항</span>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900 p-3 rounded border border-gray-200/60 dark:border-gray-800 whitespace-pre-wrap">
                                      {item.additionalRequests || "남긴 상세 메시지가 없습니다."}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-gray-400">
                        해당 상태의 예약 목록이 비어 있습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* [B] Inquiries Management Table */}
        {(activeMenu === "dashboard" || activeMenu === "inquiries") && (
          <div className="rounded-3xl border border-gray-200/50 bg-white overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="px-3.5 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-850 flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-black flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                진단 문의 목록 ({filteredInquiries.length}건)
              </h3>
              <button
                onClick={handleDownloadInquiries}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold text-gray-700 hover:bg-gray-55 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
              >
                <Download className="h-3 w-3" />
                문의 관리 다운 엑셀파일
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-55/50 border-b border-gray-150 text-gray-400 dark:bg-gray-900/10 dark:border-gray-850">
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap">상태</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap">이름</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap hidden md:table-cell">연락처</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold whitespace-nowrap hidden md:table-cell">접수일</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold text-center whitespace-nowrap">관리</th>
                    <th className="py-2.5 px-1.5 sm:py-3 sm:px-4 font-bold text-center whitespace-nowrap">상세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 dark:divide-gray-800">
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.map((item) => {
                      const isExpanded = !!expandedRows[item.id];
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="hover:bg-gray-55/35 dark:hover:bg-gray-900/5 transition-colors">
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 whitespace-nowrap">
                              <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-extrabold whitespace-nowrap ${
                                item.status === "대기" 
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                  : item.status === "진행중"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 font-bold whitespace-nowrap">{item.name}</td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 font-mono whitespace-nowrap hidden md:table-cell">{item.phone}</td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 text-gray-400 whitespace-nowrap hidden md:table-cell">{item.createdAt.split(" ")[0]}</td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 text-center">
                              <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                                <button
                                  onClick={() => updateInquiryStatus(item.id, "진행중")}
                                  className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/45 text-[9px] sm:text-[10px] font-bold whitespace-nowrap"
                                >
                                  진행<span className="hidden sm:inline">중</span>
                                </button>
                                <button
                                  onClick={() => updateInquiryStatus(item.id, "완료")}
                                  className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/45 text-[9px] sm:text-[10px] font-bold whitespace-nowrap"
                                >
                                  완료
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("정말 이 문의를 삭제하시겠습니까?")) deleteInquiry(item.id);
                                  }}
                                  className="p-1 rounded hover:bg-red-50 text-red-500 dark:hover:bg-red-950/20 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-1.5 sm:py-3.5 sm:px-4 text-center">
                              <button
                                onClick={() => toggleRow(item.id)}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-400 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-gray-55 dark:bg-gray-900/30">
                              <td colSpan={6} className="p-4 md:p-5 border-t border-b border-gray-150 dark:border-gray-800">
                                <div className="flex flex-col gap-4 md:gap-6 animate-in slide-in-from-top-2 duration-150">
                                  {/* Mobile Only Info Card */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden border-b border-gray-200 dark:border-gray-800 pb-3">
                                    <div>
                                      <span className="block text-[10px] font-bold text-gray-455 mb-0.5">연락처</span>
                                      <span className="text-xs font-mono text-gray-800 dark:text-gray-200">{item.phone}</span>
                                    </div>
                                    <div>
                                      <span className="block text-[10px] font-bold text-gray-455 mb-0.5">접수일</span>
                                      <span className="text-xs text-gray-800 dark:text-gray-200">{item.createdAt}</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                    <div className="flex-1">
                                      <span className="block text-[10px] font-bold text-gray-455 mb-1">진단 종류</span>
                                      <span className="text-xs font-black text-gray-600 dark:text-gray-250 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-gray-200/60 dark:border-gray-800">{item.type}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] font-bold text-gray-455 mb-1">남기신 문의사항</span>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-900 p-3 rounded border border-gray-200/60 dark:border-gray-800 whitespace-pre-wrap">
                                      {item.additionalRequests || "남긴 상세 메시지가 없습니다."}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-gray-400">
                        해당 상태의 문의 목록이 비어 있습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 4. CASE 수정 MODAL WINDOW */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-950 flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 dark:border-gray-850">
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <Edit2 className="h-4.5 w-4.5 text-blue-500" />
                {editingCase ? "성공 사례(Case) 정보 수정" : "신규 성공 사례(Case) 추가"}
              </h3>
              <button
                onClick={() => setIsCaseModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-bold"
              >
                닫기
              </button>
            </div>

            <form onSubmit={handleSaveCase} className="space-y-3 py-3 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">슬러그</label>
                  <input
                    type="text"
                    required
                    placeholder="예: fitness-club"
                    disabled={!!editingCase}
                    value={caseForm.slug}
                    onChange={(e) => setCaseForm({ ...caseForm, slug: e.target.value })}
                    className="w-full rounded-lg border border-gray-250 bg-white/50 px-2.5 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50 disabled:bg-gray-100 dark:disabled:bg-gray-900/70"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">브랜드/업체명</label>
                  <input
                    type="text"
                    required
                    placeholder="예: OO 필라테스"
                    value={caseForm.title}
                    onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-250 bg-white/50 px-2.5 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">업종 카테고리</label>
                  <select
                    value={caseForm.category}
                    onChange={(e) => setCaseForm({ ...caseForm, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-250 bg-white px-2.5 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  >
                    <option value="스포츠/헬스">스포츠/헬스</option>
                    <option value="전문직/상담">전문직/상담</option>
                    <option value="생활/서비스">생활/서비스</option>
                    <option value="식음료/F&B">식음료/F&B</option>
                    <option value="뷰티/에스테틱">뷰티/에스테틱</option>
                    <option value="비즈니스">비즈니스</option>
                    <option value="학원/교육">학원/교육</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">문의 전환 상승 수치</label>
                  <input
                    type="text"
                    placeholder="예: 문의 +180%"
                    value={caseForm.conversionRate}
                    onChange={(e) => setCaseForm({ ...caseForm, conversionRate: e.target.value })}
                    className="w-full rounded-lg border border-gray-250 bg-white/50 px-2.5 py-2 text-xs outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">상세 내용 설명 (프로젝트 요약)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="대시보드 카드와 상세 페이지에 노출될 분석/구축 성과를 기재해 주세요."
                  value={caseForm.details}
                  onChange={(e) => setCaseForm({ ...caseForm, details: e.target.value })}
                  className="w-full rounded-lg border border-gray-250 bg-white/50 px-2.5 py-2 text-xs outline-none resize-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-900/50"
                />
              </div>

              {caseModalError && (
                <p className="text-[10px] font-bold text-red-500 text-center animate-pulse">{caseModalError}</p>
              )}

              <div className="flex gap-2 justify-end pt-3 border-t border-gray-150 dark:border-gray-850">
                <button
                  type="button"
                  onClick={() => setIsCaseModalOpen(false)}
                  className="rounded-lg border border-gray-250 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-55 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500"
                >
                  저장하기
                </button>
              </div>
            </form>

            {/* List of cases under editable view for simple management */}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-850 pt-4 flex-1">
              <span className="block text-[11px] font-black text-gray-500 dark:text-gray-400 mb-2.5">
                등록된 성공 사례 목록 ({cases.length}개)
              </span>
              <div className="divide-y divide-gray-150 dark:divide-gray-850 max-h-[180px] overflow-y-auto border border-gray-200/50 rounded-xl bg-gray-55/50 dark:border-gray-800 dark:bg-gray-900/20">
                {cases.map((c) => (
                  <div key={c.slug} className="flex items-center justify-between p-3 hover:bg-gray-100/50 dark:hover:bg-gray-900/30 gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">{c.category}</span>
                      <span className="text-xs font-bold text-gray-850 dark:text-gray-250 block truncate">{c.title} <span className="text-gray-400 font-normal text-[10px]">({c.slug})</span></span>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenCaseModal(c)}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750 dark:text-gray-300 text-[10px] font-bold"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCase(c.slug)}
                        className="p-1 rounded hover:bg-red-50 text-red-500 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Account Password Reset Modal */}
      {isResetPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-gray-900 dark:text-white">
            <h3 className="text-base font-black mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-500" />
              비밀번호 재설정
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (resetNewPw.length < 6) {
                setResetPwError("새 비밀번호는 6자리 이상이어야 합니다.");
                return;
              }
              if (resetNewPw !== resetConfirmPw) {
                setResetPwError("새 비밀번호가 일치하지 않습니다.");
                return;
              }

              // 현재 비밀번호 검증 (재인증)
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email: adminEmail,
                password: resetCurrentPw,
              });
              if (signInError) {
                setResetPwError("현재 비밀번호가 일치하지 않습니다.");
                return;
              }

              // 비밀번호 변경
              const { error: updateError } = await supabase.auth.updateUser({ password: resetNewPw });
              if (updateError) {
                setResetPwError(updateError.message || "비밀번호 변경에 실패했습니다.");
                return;
              }
              alert("비밀번호가 성공적으로 재설정되었습니다.");
              setIsResetPasswordModalOpen(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">현재 비밀번호</label>
                <input
                  type="password"
                  required
                  placeholder="현재 비밀번호 입력"
                  value={resetCurrentPw}
                  onChange={(e) => setResetCurrentPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  required
                  placeholder="새 비밀번호 입력 (6자 이상)"
                  value={resetNewPw}
                  onChange={(e) => setResetNewPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  required
                  placeholder="새 비밀번호 다시 입력"
                  value={resetConfirmPw}
                  onChange={(e) => setResetConfirmPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-2.5 px-3 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {resetPwError && (
                <p className="text-[10px] font-bold text-red-500 text-center">{resetPwError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55 dark:bg-gray-900 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all"
                >
                  변경 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in-50 duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 text-center shadow-2xl animate-in zoom-in-95 duration-200 text-gray-900 dark:text-white">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-650 dark:text-red-400">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black mb-2">계정을 삭제하시겠습니까?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
              정말로 관리자 계정을 삭제하시겠습니까?<br />
              삭제 시 계정이 영구적으로 제거되며,<br />
              로그아웃 후 메인 페이지로 이동합니다.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55 dark:bg-gray-900 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 rounded-xl bg-red-650 py-2.5 text-xs font-bold text-white hover:bg-red-600 transition-all"
              >
                삭제 확정
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
