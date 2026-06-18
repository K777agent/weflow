// 공개 폼(예약/진단) 공통 입력 검증 유틸

// 연락처 형식 검증.
//  - 하이픈/공백은 허용하고 숫자만 추출해 검사합니다.
//  - 0 으로 시작하는 9~11자리(일반 전화/휴대폰) 를 유효한 것으로 봅니다.
export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/[^0-9]/g, "");
  return /^0\d{8,10}$/.test(digits);
};
