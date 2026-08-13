import { useState } from "react";
import { CreditIcon } from "../../../../shared/components/icons";
import { PRESSABLE_FILL_ICON_STATE_CLASS } from "../../../../shared/styles/buttonStateStyles";
import { Button } from "../../../../shared/components/Button";
import MarkdownContent from "../../../../shared/components/MarkdownContent";
import SectionBlock from "../blocks/SectionBlock";
import AiPreReviewResultCard from "./AiPreReviewResultCard";
import type { AiPreReviewData } from "./types";

interface AiPreReviewPanelProps {
  data: AiPreReviewData;
  onCreateRevision: () => void;
  onApplyRevision?: () => Promise<boolean>;
  onKeepRevision?: () => void;
  readabilityErrorMessage?: string | null;
  isApplyingRevision?: boolean;
  applyRevisionErrorMessage?: string | null;
  canApplyRevision?: boolean;
}

const AiPreReviewPanel = ({
  data,
  onCreateRevision,
  onApplyRevision,
  onKeepRevision,
  readabilityErrorMessage = null,
  isApplyingRevision = false,
  applyRevisionErrorMessage = null,
  canApplyRevision = false,
}: AiPreReviewPanelProps) => {
  const [isRevisionVisible, setIsRevisionVisible] = useState(false);

  const handleCreateRevision = () => {
    onCreateRevision();

    if (data.revisionProposal) {
      setIsRevisionVisible(true);
    }
  };

  const handleKeepRevision = () => {
    onKeepRevision?.();
    setIsRevisionVisible(false);
  };

  const handleApplyRevision = async () => {
    if (!onApplyRevision) {
      return;
    }

    const wasApplied = await onApplyRevision();

    if (wasApplied) {
      setIsRevisionVisible(false);
    }
  };

  return (
    <SectionBlock>
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full items-center overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className="text-base leading-[26px] font-normal text-gray-900">
              AI 사전 검토
            </h3>
            <span className="text-xs leading-[15px] font-normal text-gray-600">
              · {data.perspectiveLabel}
            </span>
          </div>
        </div>

        {readabilityErrorMessage && (
          <p className="text-error text-xs leading-4">
            {readabilityErrorMessage}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {data.results.map((result) => (
            <AiPreReviewResultCard
              key={result.id}
              result={result}
            />
          ))}
        </div>

        {!isRevisionVisible && (
          <Button
            type="ai"
            onClick={handleCreateRevision}
            className="h-[52px] w-full px-4 py-3 text-lg leading-7 font-semibold"
          >
            <CreditIcon
              size={20}
              className={PRESSABLE_FILL_ICON_STATE_CLASS}
            />
            수정안 만들기
          </Button>
        )}

        {isRevisionVisible && data.revisionProposal && (
          <section className="border-main-600 bg-main-50 flex w-full flex-col gap-2 rounded-lg border p-4">
            <h4 className="text-main-700 text-base leading-6 font-normal">
              {data.revisionProposal.title} (변경{" "}
              {data.revisionProposal.changedCount}곳)
            </h4>
            <MarkdownContent
              content={data.revisionProposal.content}
              className="text-[13px] leading-5 [&_h1]:mt-3 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:leading-7 [&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:leading-6 [&_h3]:mt-3 [&_h3]:mb-2 [&_h3]:text-[15px] [&_h3]:leading-6 [&_h4]:mt-3 [&_h4]:mb-2 [&_h4]:text-sm [&_p]:my-2"
            />

            <div className="flex w-full items-end justify-end gap-2">
              <p className="text-xs leading-4 font-normal text-gray-600">
                {data.revisionProposal.notice}
              </p>
              <Button
                type="outline"
                onClick={handleKeepRevision}
                className="h-8 rounded-sm px-4 py-2 text-xs leading-4 font-medium"
              >
                유지하기
              </Button>
              {canApplyRevision && (
                <Button
                  type="main"
                  onClick={() => void handleApplyRevision()}
                  disabled={isApplyingRevision}
                  className="h-8 rounded-sm px-4 py-2 text-xs leading-4 font-medium"
                >
                  {isApplyingRevision ? "적용 중..." : "수정안 적용"}
                </Button>
              )}
            </div>
            {applyRevisionErrorMessage && (
              <p className="text-error text-xs leading-4">
                {applyRevisionErrorMessage}
              </p>
            )}
          </section>
        )}
      </div>
    </SectionBlock>
  );
};

export default AiPreReviewPanel;
