export type DocumentType = "proposal" | "presentation"; // 제안서 / 발표구성안

export const PROPOSAL_SECTIONS = [
  "제안 배경",
  "문제 및 필요성",
  "목표 및 제안 범위",
  "제안 내용",
  "실행 방안",
  "기대 효과",
] as const;

export const PRESENTATION_SECTIONS = [
  "문제 정의",
  "타겟 사용자",
  "해결 방향",
  "핵심 기능",
  "차별점",
  "기대 효과",
] as const;

export type ProposalSectionName = (typeof PROPOSAL_SECTIONS)[number];
export type PresentationSectionName = (typeof PRESENTATION_SECTIONS)[number];
export type SectionName = ProposalSectionName | PresentationSectionName;

export const SECTION_STATUSES = [
  "시작 전",
  "의견 모으기",
  "정리·초안",
  "검토·확정",
  "작성 완료",
] as const;

export type SectionStatusValue = (typeof SECTION_STATUSES)[number];

export const SECTION_PHASES = [
  "의견 모으기",
  "정리·초안",
  "검토·확정",
] as const;

export type SectionPhase = (typeof SECTION_PHASES)[number];

export interface SectionProgress {
  section: SectionName;
  status: SectionStatusValue;
}

export type DocumentProgress = SectionProgress[];
