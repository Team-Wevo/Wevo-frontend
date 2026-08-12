import { cn } from "../../../../shared/utils/cn";
import MarkdownContent from "../../../../shared/components/MarkdownContent";
import SectionBlock from "../blocks/SectionBlock";
import { STAGE_CONTENT_BY_STAGE } from "./constants";
import type { DraftStage } from "./types";

interface DraftBodyProps {
  stage: DraftStage;
  draftContent: string | null;
  fitContent?: boolean;
}

const DraftBody = ({
  stage,
  draftContent,
  fitContent = false,
}: DraftBodyProps) => {
  const content = draftContent ?? STAGE_CONTENT_BY_STAGE[stage];

  return (
    <SectionBlock>
      <MarkdownContent
        content={content}
        className={cn(
          fitContent ? "h-auto" : "h-48 overflow-y-auto",
          stage === "generating" ? "text-gray-600" : "text-gray-900",
        )}
      />
    </SectionBlock>
  );
};

export default DraftBody;
