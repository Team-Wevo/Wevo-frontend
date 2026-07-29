import type { ReactNode } from "react";
import { AlertTriangle, CircleHelp, Lightbulb } from "lucide-react";
import type { AiPreReviewResult, AiPreReviewResultType } from "./types";

interface AiPreReviewResultCardProps {
  result: AiPreReviewResult;
}

const TYPE_ICON: Record<AiPreReviewResultType, ReactNode> = {
  blocked_sentence: <AlertTriangle className="text-main-600 h-4 w-4" />,
  hidden_assumption: <Lightbulb className="text-main-300 h-4 w-4" />,
  reader_question: <CircleHelp className="text-main-500 h-4 w-4" />,
};

const AiPreReviewResultCard = ({ result }: AiPreReviewResultCardProps) => {
  return (
    <section className="flex w-full flex-col gap-2 rounded-lg bg-gray-100 p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center">
          {TYPE_ICON[result.type]}
        </span>
        <span className="text-xs leading-4 font-medium text-gray-900">
          {result.title}
        </span>
      </div>

      {result.findings.map((finding, index) => (
        <div
          key={`${result.id}-${index}`}
          className="flex flex-col gap-1"
        >
          <p className="text-xs leading-5 font-normal text-gray-900">
            {finding.description}
          </p>
          {finding.suggestion && (
            <p className="text-main-700 text-xs leading-5 font-normal">
              {finding.suggestion}
            </p>
          )}
        </div>
      ))}
    </section>
  );
};

export default AiPreReviewResultCard;
