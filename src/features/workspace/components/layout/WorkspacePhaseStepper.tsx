import { Fragment } from "react";
import { cn } from "../../../../shared/utils/cn";
import {
  SECTION_PHASES,
  type SectionPhase,
  type SectionStatusValue,
} from "../../../../shared/types/documentType";

interface WorkspacePhaseStepperProps {
  currentStatus: SectionStatusValue;
  selectedPhase: SectionPhase;
  onPhaseSelect: (phase: SectionPhase) => void;
}

const WorkspacePhaseStepper = ({
  currentStatus,
  selectedPhase,
  onPhaseSelect,
}: WorkspacePhaseStepperProps) => {
  const currentPhase: SectionPhase =
    currentStatus === "시작 전"
      ? "의견 모으기"
      : currentStatus === "작성 완료"
        ? "검토·확정"
        : currentStatus;
  const currentPhaseIndex = SECTION_PHASES.indexOf(currentPhase);

  return (
    <div className="flex w-full items-center justify-start gap-3">
      {SECTION_PHASES.map((phase, index) => {
        const isActive = phase === selectedPhase;
        const isFuturePhase = index > currentPhaseIndex;
        const isLastPhase = index === SECTION_PHASES.length - 1;
        const isDone = currentStatus === "작성 완료" && isLastPhase;
        return (
          <Fragment key={phase}>
            <button
              type="button"
              disabled={isFuturePhase}
              onClick={() => onPhaseSelect(phase)}
              aria-current={isActive ? "step" : undefined}
              title={
                isFuturePhase
                  ? "이전 단계를 완료해야 이동할 수 있어요."
                  : undefined
              }
              className="flex items-center justify-start gap-2 overflow-hidden enabled:cursor-pointer disabled:cursor-not-allowed"
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[11px] leading-4 font-normal",
                  isDone
                    ? "bg-green-700 text-gray-50"
                    : isActive
                      ? "bg-main-600 text-gray-50"
                      : "bg-gray-100 text-gray-600",
                )}
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span
                className={cn(
                  isActive
                    ? "text-lg leading-7 font-semibold text-gray-900"
                    : "text-xs leading-4 font-medium text-gray-600",
                )}
              >
                {phase}
              </span>
            </button>
            {index < SECTION_PHASES.length - 1 && (
              <div className="relative h-px flex-1 bg-gray-400" />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default WorkspacePhaseStepper;
