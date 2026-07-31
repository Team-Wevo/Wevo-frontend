import DraftBody from "./DraftBody";
import DraftFooter from "./DraftFooter";
import DraftStatusHeader from "./DraftStatusHeader";
import type { DraftStageViewProps } from "./types";

const DraftGeneratingView = ({ state }: DraftStageViewProps) => {
  return (
    <>
      <DraftStatusHeader state={state} />
      <DraftBody
        stage={state.stage}
        draftContent={state.draftContent}
      />
      <DraftFooter canRequestReview={false} />
    </>
  );
};

export default DraftGeneratingView;
