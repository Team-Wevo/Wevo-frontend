import { Check } from "lucide-react";
import SectionBlock from "./SectionBlock";
import { CreditLoadingIcon } from "../../../../shared/components/icons";
import { useSequentialTaskProgress } from "../../hooks/useSequentialTaskProgress";
import { cn } from "../../../../shared/utils/cn";

export type AiAnalysisTaskStatus = "completed" | "active" | "pending";

/** 진행 상태 없이 순서만 정의한 단계 */
export interface AiAnalysisTaskStep {
  id: string;
  /** "중"을 뺀 기본형. 진행 중일 때만 "중"을 붙여 보여준다. */
  label: string;
}

export interface AiAnalysisTask extends AiAnalysisTaskStep {
  status: AiAnalysisTaskStatus;
}

interface AiDraftProgressCardProps {
  participantCount: number;
  steps: AiAnalysisTaskStep[];
  notice: string;
}

const STATUS_TEXT_CLASS: Record<AiAnalysisTaskStatus, string> = {
  completed: "text-gray-900",
  active: "text-gray-900",
  pending: "text-gray-600",
};

const StatusIndicator = ({ status }: { status: AiAnalysisTaskStatus }) => {
  if (status === "completed") {
    return (
      <span className="flex h-2.5 w-2.5 items-center justify-center rounded-full">
        <Check
          className="text-success h-2 w-2"
          strokeWidth={5}
        />
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="bg-main-600 h-2.5 w-2.5 animate-pulse rounded-full" />
    );
  }

  return <span className="h-2.5 w-2.5 rounded-full border border-gray-600" />;
};

const AiDraftProgressCard = ({
  participantCount,
  steps,
  notice,
}: AiDraftProgressCardProps) => {
  const tasks = useSequentialTaskProgress({ steps });

  return (
    <SectionBlock>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full">
            <CreditLoadingIcon size={21} />
          </span>
          <h2 className="text-lg leading-7 font-semibold text-gray-900">
            AI가 팀원 {participantCount}명의 의견을 정리하고 있어요.
          </h2>
        </div>

        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2"
            >
              <StatusIndicator status={task.status} />
              <span
                className={cn(
                  "text-xs leading-5 font-normal transition-colors",
                  STATUS_TEXT_CLASS[task.status],
                )}
              >
                {task.status === "active" ? `${task.label} 중` : task.label}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-xs leading-4 font-normal text-gray-600">{notice}</p>
      </div>
    </SectionBlock>
  );
};

export default AiDraftProgressCard;
