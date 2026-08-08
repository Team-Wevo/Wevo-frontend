import { useQuery } from "@tanstack/react-query";
import { getTeamReviews } from "../api/getTeamReviews";

export const TEAM_REVIEWS_QUERY_KEY = "team-reviews";

/**
 * 섹션의 팀 검토 현황을 조회한다.
 * 확정 완료 화면에서도 동의 집계를 표시하므로 섹션 상태와 무관하게 조회한다.
 */
export const useTeamReviews = (sectionId: number) =>
  useQuery({
    queryKey: [TEAM_REVIEWS_QUERY_KEY, sectionId],
    queryFn: () => getTeamReviews(sectionId),
  });
