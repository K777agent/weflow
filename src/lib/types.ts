export interface CaseStudy {
  slug: string;
  title: string;
  category: string;
  image: string; // File path e.g. /images/cases/cases_pilates.jpg
  conversionRate?: string; // e.g. "문의 +180% 상승"
  details: string; // Description for the case modal
}

export interface Review {
  id: number;
  author: string;
  text: string;
  rating: number; // e.g. 5
}

export interface ReservationInput {
  name: string;
  phone: string;
  date: string;
  time: string;
  type: string; // Dropdown value
  industry: string;
  additionalRequests: string;
  privacyConsent: boolean;
}

export interface DiagnosisInput {
  name: string;
  phone: string;
  type: string; // Dropdown value
  industry: string;
  additionalRequests: string;
  privacyConsent: boolean;
}

export interface Reservation extends ReservationInput {
  id: string;
  status: "대기" | "진행중" | "완료";
  createdAt: string;
}

export interface Inquiry extends DiagnosisInput {
  id: string;
  status: "대기" | "진행중" | "완료";
  createdAt: string;
}

