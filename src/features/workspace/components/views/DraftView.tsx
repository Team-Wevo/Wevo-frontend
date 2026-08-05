import { useEffect, useState, type ComponentType } from "react";
import { useRevalidator } from "react-router-dom";
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
import {
  requestReview,
  getRequestReviewErrorMessage,
} from "../../api/requestReview";

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
  const revalidator = useRevalidator();
  const [debugStage, setDebugStage] =
    useState<DebugDraftStage>("opinion-analyzing");
  const [isMovingToReviewRequest, setIsMovingToReviewRequest] = useState(false);
  const [moveToReviewRequestErrorMessage, setMoveToReviewRequestErrorMessage] =
    useState<string | null>(null);

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

  const handleMoveToReviewRequest = async () => {
    setIsMovingToReviewRequest(true);
    setMoveToReviewRequestErrorMessage(null);

    try {
      await requestReview(section.projectSectionId);
      // 검토 요청 성공 시 loader를 다시 실행해 섹션 상태(REVIEWING)를 반영한다.
      await revalidator.revalidate();
    } catch (error) {
      setMoveToReviewRequestErrorMessage(getRequestReviewErrorMessage(error));
    } finally {
      setIsMovingToReviewRequest(false);
    }
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
              isMovingToReviewRequest={isMovingToReviewRequest}
              moveToReviewRequestErrorMessage={moveToReviewRequestErrorMessage}
            />
          );
        })()
      )}
    </div>
  );
};

export default DraftView;
