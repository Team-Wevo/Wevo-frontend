import { Sparkles } from "lucide-react";
import { Button } from "../../../../shared/components/Button";

interface DraftReadabilityCardProps {
  description?: string;
  disabled?: boolean;
  onRequestReadabilityCheck: () => void;
}

const DraftReadabilityCard = ({
  description = "AI가 처음 읽는 사람의 관점에서 문장과 흐름을 점검해요.",
  disabled = false,
  onRequestReadabilityCheck,
}: DraftReadabilityCardProps) => {
  return (
    <section
      className={`${disabled ? "bg-gray-200" : "bg-main-50"} flex w-full flex-col gap-3 rounded-[12px] p-5`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-main-600 flex h-6 w-6 items-center justify-center rounded-full">
          <Sparkles className="h-5 w-5" />
        </span>
        <h3 className="text-lg leading-7 font-semibold text-gray-900">
          AI 읽힘 점검
        </h3>
      </div>
      <p className="text-base leading-6 font-normal text-gray-700">
        {description}
      </p>
      <div className="flex justify-end">
        <Button
          type="outline"
          onClick={onRequestReadabilityCheck}
          disabled={disabled}
          className="h-8 rounded-sm border-gray-400 bg-white px-4 py-2 text-xs leading-4 font-medium text-gray-800"
        >
          <Sparkles className="text-main-600 h-4 w-4" />
          AI 읽힘 점검하기
        </Button>
      </div>
    </section>
  );
};

export default DraftReadabilityCard;
