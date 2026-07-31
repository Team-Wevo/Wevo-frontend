import { useEffect, useState, type ComponentType } from "react";
import AiDraftProgressCard from "../blocks/AiDraftProgressCard";
import DraftDebugStageControls from "../draft/DraftDebugStageControls";
import DraftEditedView from "../draft/DraftEditedView";
import DraftEditingView from "../draft/DraftEditingView";
import DraftGeneratedView from "../draft/DraftGeneratedView";
import DraftGeneratingView from "../draft/DraftGeneratingView";
import { MOCK_ANALYSIS_TASKS, MOCK_DRAFT_STATE_BY_STAGE } from "../draft/mock";
import DraftReviewableView from "../draft/DraftReviewableView";
import type {
  DraftStage,
  DraftStageViewProps,
  DebugDraftStage,
} from "../draft/types";
import type { WorkspaceSection } from "../../constants/sections";

interface DraftViewProps {
  section: WorkspaceSection;
}

const DRAFT_STAGE_VIEW_COMPONENTS: Record<
  DraftStage,
  ComponentType<DraftStageViewProps>
> = {
  generating: DraftGeneratingView,
  generated: DraftGeneratedView,
  editing: DraftEditingView,
  edited: DraftEditedView,
  reviewable: DraftReviewableView,
};

const DraftView = ({ section }: DraftViewProps) => {
  const [debugStage, setDebugStage] =
    useState<DebugDraftStage>("opinion-analyzing");

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(
      '[data-workspace-scroll-container="true"]',
    );

    if (!scrollContainer) {
      return;
    }

    scrollContainer.scrollTo({ top: 0 });
  }, [debugStage]);

  const handleOpenEvidence = () => {
    // TODO: 근거 상세 패널/모달 연결
  };

  const handleRequestReadabilityCheck = () => {
    setDebugStage("reviewable");
  };

  const handleMoveToEditing = () => {
    setDebugStage("editing");
  };

  const handleFinishEditing = () => {
    setDebugStage("edited");
  };

  const handleMoveToReviewRequest = () => {
    // TODO: section 단계 이동 규칙 확정 후 검토·확정 이동 연결
  };

  const isOpinionAnalyzingStage = debugStage === "opinion-analyzing";

  return (
    <div
      aria-label={`${section.orderNo}. ${section.title} 초안 작성 상태`}
      className="flex w-full flex-col gap-6"
    >
      <DraftDebugStageControls
        stage={debugStage}
        onChangeStage={setDebugStage}
      />

      {isOpinionAnalyzingStage ? (
        <AiDraftProgressCard
          participantCount={3}
          tasks={MOCK_ANALYSIS_TASKS}
          notice="의견 수에 따라 잠시 시간이 걸릴 수 있어요."
        />
      ) : (
        (() => {
          const currentDraftState = MOCK_DRAFT_STATE_BY_STAGE[debugStage];
          const CurrentDraftStageView =
            DRAFT_STAGE_VIEW_COMPONENTS[currentDraftState.stage];

          return (
            <CurrentDraftStageView
              state={currentDraftState}
              onEditDraft={handleMoveToEditing}
              onOpenEvidence={handleOpenEvidence}
              onRequestReadabilityCheck={handleRequestReadabilityCheck}
              onFinishEditing={handleFinishEditing}
              onMoveToReviewRequest={handleMoveToReviewRequest}
            />
          );
        })()
      )}
    </div>
  );
};

export default DraftView;
