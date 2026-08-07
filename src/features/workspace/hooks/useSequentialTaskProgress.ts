import { useEffect, useMemo, useState } from "react";
import type {
  AiAnalysisTask,
  AiAnalysisTaskStep,
} from "../components/blocks/AiDraftProgressCard";

interface UseSequentialTaskProgressOptions {
  steps: AiAnalysisTaskStep[];
  /** 한 단계가 진행 중으로 머무는 시간 */
  stepDurationMs?: number;
}

/**
 * 단계 목록을 앞에서부터 하나씩 완료 처리해 진행 중인 것처럼 보여준다.
 * 아직 진행률을 내려주는 API가 없어 프론트에서 시간 기반으로 흉내낸다.
 */
export const useSequentialTaskProgress = ({
  steps,
  stepDurationMs = 4000,
}: UseSequentialTaskProgressOptions): AiAnalysisTask[] => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= steps.length) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setActiveIndex((previous) => previous + 1);
    }, stepDurationMs);

    return () => window.clearTimeout(timerId);
  }, [activeIndex, steps.length, stepDurationMs]);

  return useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        status:
          index < activeIndex
            ? "completed"
            : index === activeIndex
              ? "active"
              : "pending",
      })),
    [steps, activeIndex],
  );
};
