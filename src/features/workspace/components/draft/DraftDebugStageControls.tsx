import { Button } from "../../../../shared/components/Button";
import { DEBUG_STAGE_OPTIONS, DEV_STAGE_CONTROL_LABEL } from "./constants";
import type { DebugDraftStage } from "./types";

interface DraftDebugStageControlsProps {
  stage: DebugDraftStage;
  onChangeStage: (stage: DebugDraftStage) => void;
}

const DraftDebugStageControls = ({
  stage,
  onChangeStage,
}: DraftDebugStageControlsProps) => {
  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-sm border border-gray-300 bg-gray-50 p-3"
      aria-label={DEV_STAGE_CONTROL_LABEL}
    >
      {DEBUG_STAGE_OPTIONS.map((option) => (
        <Button
          key={option.id}
          type={stage === option.id ? "main" : "outline"}
          onClick={() => onChangeStage(option.id)}
          className="h-8 px-3 py-1 text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default DraftDebugStageControls;
