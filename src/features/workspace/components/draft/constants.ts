import type { DraftActivity, DraftStage, DraftStageOption } from "./types";

export const ACTIVITY_TONE_CLASS: Record<DraftActivity["tone"], string> = {
  success: "text-success",
  processing: "text-main-600",
};

export const STAGE_CONTENT_BY_STAGE: Record<DraftStage, string> = {
  generating: "초안 생성 중...",
  generated: "초안 생성이 완료되었습니다.",
  editing: "초안을 편집하고 있어요.",
  edited: "초안 편집이 완료되었습니다.",
  reviewable: "사전 검토를 진행할 수 있어요.",
};

export const DEV_STAGE_CONTROL_LABEL = "Draft 상태 확인 (개발용)";

export const DEBUG_STAGE_OPTIONS: DraftStageOption[] = [
  { id: "opinion-analyzing", label: "1. AI 의견 정리 중" },
  { id: "generating", label: "2. 초안 생성 중" },
  { id: "generated", label: "3. 초안 생성 완료" },
  { id: "editing", label: "4. 초안 편집 중" },
  { id: "edited", label: "5. 초안 편집 완료" },
  { id: "reviewable", label: "6. AI 사전 검토 가능" },
];
