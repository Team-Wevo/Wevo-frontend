import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/user";

export const MY_PROFILE_QUERY_KEY = ["myProfile"] as const;

/**
 * 로그인한 사용자의 프로필을 조회한다.
 * 비로그인 상태에서 호출하면 401 인터셉터가 홈으로 강제 이동시키므로
 * `enabled`로 요청 자체를 막는다.
 */
export const useMyProfile = (enabled: boolean) =>
  useQuery({
    queryKey: MY_PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    enabled,
  });
