import { useQuery } from "@tanstack/react-query";
import { getSectionConfirmReadiness } from "../api/getSectionConfirmReadiness";

export const SECTION_CONFIRM_READINESS_QUERY_KEY = "section-confirm-readiness";

/**
 * 섹션 확정 가능 여부를 조회한다.
 * 확정 버튼이 없는 화면(확정 완료·팀원 시점)에서는 `enabled`로 요청 자체를 막는다.
 */
export const useSectionConfirmReadiness = (
  sectionId: number,
  enabled: boolean,
) =>
  useQuery({
    queryKey: [SECTION_CONFIRM_READINESS_QUERY_KEY, sectionId],
    queryFn: () => getSectionConfirmReadiness(sectionId),
    enabled,
  });
