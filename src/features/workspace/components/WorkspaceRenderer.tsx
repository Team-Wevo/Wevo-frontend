import type { WorkspaceSection } from "../constants/sections";
import type { WorkspacePhase } from "../utils/getWorkspacePhase";
import DraftView from "./views/DraftView";
import OpinionView from "./views/OpinionView";
import ReviewView from "./views/ReviewView";

interface WorkspaceRendererProps {
  phase: WorkspacePhase;
  section: WorkspaceSection;
}

const WorkspaceRenderer = ({ phase, section }: WorkspaceRendererProps) => {
  if (phase === "의견 모으기") {
    return <OpinionView section={section} />;
  }

  if (phase === "정리·초안") {
    return <DraftView section={section} />;
  }

  return <ReviewView section={section} />;
};

export default WorkspaceRenderer;
