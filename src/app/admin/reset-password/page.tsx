"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  // 메일 링크로 진입했는지(=재설정 세션이 있는지) 확인
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 비밀번호 재설정 메일 링크는 URL 해시로 세션을 전달합니다.
    // detectSessionInUrl(true) 설정으로 자동 처리되며, 여기서 세션 존재를 확인합니다.
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
    };
    check();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 6) return setError("새 비밀번호는 6자리 이상이어야 합니다.");
    if (newPw !== confirmPw) return setError("새 비밀번호가 일치하지 않습니다.");

    setError("");
    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPw });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message || "비밀번호 변경에 실패했습니다.");
      return;
    }
    setIsDone(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030712] px-4 py-12 text-white">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-800 bg-gray-950/40 p-8 shadow-2xl backdrop-blur-md">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl"></div>

        <div className="text-center mb-8 relative">
          <h1 className="text-2xl font-black tracking-tight">
            WEFLOW <span className="text-blue-500">ADMIN</span>
          </h1>
          <p className="mt-2 text-xs text-gray-400">비밀번호 재설정</p>
        </div>

        {isDone ? (
          <div className="text-center relative">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black mb-2">비밀번호가 변경되었습니다</h3>
            <p className="text-xs text-gray-400 mb-5">새 비밀번호로 다시 로그인해 주세요.</p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/admin");
              }}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-all"
            >
              로그인 화면으로 이동
            </button>
          </div>
        ) : hasSession === false ? (
          <div className="text-center relative">
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">
              유효한 재설정 링크가 아니거나 만료되었습니다.<br />
              비밀번호 찾기를 다시 진행해 주세요.
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-all"
            >
              로그인 화면으로 이동
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">새 비밀번호</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="새 비밀번호 (6자 이상)"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-3 pl-10 pr-4 text-xs text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">새 비밀번호 확인</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="새 비밀번호 다시 입력"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-3 pl-10 pr-4 text-xs text-white outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && <p className="text-[11px] font-bold text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed active:scale-98"
            >
              {isSubmitting ? "변경 중..." : "비밀번호 변경 완료"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
