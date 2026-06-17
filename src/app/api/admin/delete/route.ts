import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 계정 삭제는 service_role 권한이 필요하므로 서버 라우트에서만 처리합니다.
// 클라이언트는 로그인 세션의 access token 을 Authorization 헤더로 전달합니다.
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return NextResponse.json(
      { error: "서버 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return NextResponse.json({ error: "인증 토큰이 없습니다." }, { status: 401 });
  }

  // service_role 클라이언트 (서버 전용)
  const admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 토큰으로 요청자 신원 확인
  const { data: userData, error: userError } = await admin.auth.getUser(token);
  if (userError || !userData?.user) {
    return NextResponse.json({ error: "유효하지 않은 세션입니다." }, { status: 401 });
  }

  // 본인 계정 삭제
  const { error: deleteError } = await admin.auth.admin.deleteUser(userData.user.id);
  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message || "계정 삭제에 실패했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
