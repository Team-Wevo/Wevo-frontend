import { apiClient } from "../../../shared/api/client";
import {
  getApiErrorMessage,
  getApiErrorResponse,
} from "../../../shared/api/error";
import { unwrapApiResponse } from "../../../shared/api/response";
import type { ApiResponse } from "../../../shared/api/types";

export interface OpinionDraftResponse {
  id: number;
  content: string;
  updatedAt: string;
}

export interface OpinionSubmitResponse {
  id: number;
  submittedAt: string;
}

const SAVE_OPINION_DRAFT_FALLBACK_MESSAGE = "의견 임시저장에 실패했습니다.";
const SUBMIT_OPINION_FALLBACK_MESSAGE = "의견 제출에 실패했습니다.";

/** 의견 내용 가드레일 거부(O005) 코드. */
const OPINION_CONTENT_REJECTED_CODE = "O005";

/**
 * 의견 가드레일 거부 사유(errors[].reason)를 사용자용 문구로 매핑한다.
 * 서버는 O005 + reason(GIBBERISH/OFF_TOPIC)만 내려주므로, 날 사유 코드 대신
 * 무엇이 문제이고 어떻게 고치면 되는지 안내한다.
 */
const OPINION_GUARDRAIL_REASON_MESSAGE: Record<string, string> = {
  GIBBERISH: "의견 내용을 알아볼 수 없어요. 문장으로 다시 작성해 주세요.",
  OFF_TOPIC: "섹션 주제에서 벗어난 내용이에요. 주제에 맞게 다시 작성해 주세요.",
};

const getFirstReason = (errors: unknown): string | null => {
  if (!Array.isArray(errors)) {
    return null;
  }

  for (const error of errors) {
    if (
      typeof error === "object" &&
      error !== null &&
      "reason" in error &&
      typeof (error as { reason: unknown }).reason === "string"
    ) {
      const reason = (error as { reason: string }).reason.trim();
      if (reason) {
        return reason;
      }
    }
  }

  return null;
};

/**
 * 입력 중인 의견을 임시저장한다. 제출본(submit)은 그대로 유지된다.
 * "제출하기" 클릭 시 submit이 요청 본문을 받지 않으므로, 먼저 이 API로
 * 현재 텍스트를 서버에 반영한 뒤 submitOpinion을 호출해야 한다.
 */
export const saveOpinionDraft = async (
  sectionId: number,
  content: string,
): Promise<OpinionDraftResponse> => {
  const response = await apiClient.patch<ApiResponse<OpinionDraftResponse>>(
    `/api/project-sections/${sectionId}/my-opinion/draft`,
    { content },
  );

  return unwrapApiResponse(response.data);
};

export const getSaveOpinionDraftErrorMessage = (error: unknown): string => {
  return getApiErrorMessage(error, SAVE_OPINION_DRAFT_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};

/**
 * 임시저장된 의견을 제출한다. 요청 본문은 없으며, 임시저장된 내용이 20자
 * 미만이거나 아예 없으면 실패한다. 재제출 시 기존 제출본을 갱신한다.
 */
export const submitOpinion = async (
  sectionId: number,
): Promise<OpinionSubmitResponse> => {
  const response = await apiClient.post<ApiResponse<OpinionSubmitResponse>>(
    `/api/project-sections/${sectionId}/my-opinion/submit`,
  );

  return unwrapApiResponse(response.data);
};

export const getSubmitOpinionErrorMessage = (error: unknown): string => {
  const response = getApiErrorResponse(error);

  // 의견 가드레일 거부(O005)는 사유별 안내 문구로 다듬어 보여준다. 코드는 노출하지 않는다.
  if (response?.code === OPINION_CONTENT_REJECTED_CODE) {
    const reason = getFirstReason(response.errors);
    const mappedMessage = reason
      ? OPINION_GUARDRAIL_REASON_MESSAGE[reason]
      : undefined;

    return mappedMessage ?? response.message ?? SUBMIT_OPINION_FALLBACK_MESSAGE;
  }

  return getApiErrorMessage(error, SUBMIT_OPINION_FALLBACK_MESSAGE, {
    includeCode: true,
  });
};
