import { cn } from "../../../../shared/utils/cn";
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
      <div
        className={cn(
          fitContent
            ? "h-auto text-base leading-6 font-normal break-words whitespace-pre-wrap"
            : "h-48 overflow-y-auto text-base leading-6 font-normal",
          stage === "generating" ? "text-gray-600" : "text-gray-900",
        )}
      >
        {content}
      </div>
    </SectionBlock>
  );
};

export default DraftBody;
