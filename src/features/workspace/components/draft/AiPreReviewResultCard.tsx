import type { ReactNode } from "react";
import {
  BlockedSentenceIcon,
  HiddenAssumptionIcon,
  ReaderQuestionIcon,
} from "../../../../shared/components/icons";
import type { AiPreReviewResult, AiPreReviewResultType } from "./types";

interface AiPreReviewResultCardProps {
  result: AiPreReviewResult;
}

const TYPE_ICON: Record<AiPreReviewResultType, ReactNode> = {
  blocked_sentence: <BlockedSentenceIcon size={18} />,
  hidden_assumption: <HiddenAssumptionIcon size={18} />,
  reader_question: <ReaderQuestionIcon size={20} />,
};

const AiPreReviewResultCard = ({ result }: AiPreReviewResultCardProps) => {
  return (
    <section className="flex w-full flex-col gap-2 rounded-lg bg-gray-100 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center">
          {TYPE_ICON[result.type]}
        </span>
        <span className="text-[13px] leading-[18px] font-medium text-gray-900">
          {result.title}
        </span>
      </div>

      {result.findings.map((finding, index) => (
        <div
          key={`${result.id}-${index}`}
          className="flex flex-col gap-1"
        >
          <p className="text-[13px] leading-5 font-normal text-gray-900">
            {finding.description}
          </p>
          {finding.suggestion && (
            <p className="text-main-700 text-[13px] leading-5 font-normal">
              {finding.suggestion}
            </p>
          )}
        </div>
      ))}
    </section>
  );
};

export default AiPreReviewResultCard;
