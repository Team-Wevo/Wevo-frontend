import { Fragment } from "react";
import { cn } from "../../../../shared/utils/cn";
import {
  SECTION_PHASES,
  type SectionStatusValue,
} from "../../../../shared/types/documentType";

interface WorkspacePhaseStepperProps {
  currentStatus: SectionStatusValue;
}

const WorkspacePhaseStepper = ({
  currentStatus,
}: WorkspacePhaseStepperProps) => {
  const effectiveStatus =
    currentStatus === "시작 전" ? "의견 모으기" : currentStatus;

  return (
    <div className="flex h-7 w-full items-center justify-start gap-3 overflow-hidden">
      {SECTION_PHASES.map((phase, index) => {
        const isActive = phase === effectiveStatus;
        const isLastPhase = index === SECTION_PHASES.length - 1;
        const isDone = currentStatus === "작성 완료" && isLastPhase;
        return (
          <Fragment key={phase}>
            <div className="flex items-center justify-start gap-2 overflow-hidden">
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
                  isActive || isDone
                    ? "text-lg leading-7 font-semibold text-gray-900"
                    : "text-xs leading-4 font-medium text-gray-600",
                )}
              >
                {phase}
              </span>
            </div>
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
