import { useCallback, useEffect, useState } from "react";
import {
  getSectionConfirmReadiness,
  type SectionConfirmReadiness,
} from "../api/getSectionConfirmReadiness";

interface UseSectionConfirmReadinessResult {
  readiness: SectionConfirmReadiness | null;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * 섹션 확정 가능 여부를 조회한다.
 *
 * enabled가 false면 요청하지 않는다. 확정 버튼이 없는 화면(확정 완료·팀원 시점)에서
 * 불필요한 호출을 막기 위한 값이다.
 *
 * TODO: QueryClientProvider 설정 후 TanStack Query useQuery로 교체
 */
export const useSectionConfirmReadiness = (
  sectionId: number,
  enabled: boolean,
): UseSectionConfirmReadinessResult => {
  const [readiness, setReadiness] = useState<SectionConfirmReadiness | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refetchCount, setRefetchCount] = useState(0);

  const refetch = useCallback(() => {
    setRefetchCount((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let isCancelled = false;

    const loadReadiness = async () => {
      setIsLoading(true);

      try {
        const response = await getSectionConfirmReadiness(sectionId);

        if (!isCancelled) {
          setReadiness(response.success ? response.data : null);
        }
      } catch {
        // 조회에 실패하면 조건을 알 수 없으므로 비워둔다.
        // 확정 요청 시 서버가 조건을 재검증하므로 그 결과로 안내한다.
        if (!isCancelled) {
          setReadiness(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadReadiness();

    return () => {
      isCancelled = true;
    };
  }, [sectionId, refetchCount, enabled]);

  if (!enabled) {
    return { readiness: null, isLoading: false, refetch };
  }

  return { readiness, isLoading, refetch };
};
