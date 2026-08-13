import DraftBody from "./DraftBody";
import DraftFooter from "./DraftFooter";
import DraftStatusHeader from "./DraftStatusHeader";
import type { DraftStageViewProps } from "./types";

const DraftEditedView = ({
  state,
  onRequestReadabilityCheck,
  canRequestReadabilityCheck,
}: DraftStageViewProps) => {
  return (
    <>
      <DraftStatusHeader state={state} />
      <DraftBody
        stage={state.stage}
        draftContent={state.draftContent}
      />
      {canRequestReadabilityCheck && (
        <DraftFooter
          canRequestReview={true}
          onRequestReview={onRequestReadabilityCheck}
        />
      )}
    </>
  );
};

export default DraftEditedView;
