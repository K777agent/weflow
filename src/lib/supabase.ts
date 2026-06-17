import { createClient } from "@supabase/supabase-js";

// 클라이언트(브라우저)용 Supabase 인스턴스.
// service_role 키는 절대 여기서 사용하지 않습니다(서버 라우트 전용).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 개발 중 .env.local 누락을 빠르게 알아채기 위한 경고.
  // 값이 없으면 아래 placeholder 로 클라이언트를 만들어 빌드는 통과시키되,
  // 실제 호출은 실패하므로 .env.local 설정이 반드시 필요합니다.
  console.warn(
    "[Supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 가 설정되지 않았습니다. .env.local 을 확인하세요."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // 비밀번호 재설정 메일 링크 처리에 필요
    },
  }
);
