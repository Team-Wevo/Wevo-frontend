import { Button } from "../../../../shared/components/Button";
import { CreditIcon } from "../../../../shared/components/icons";
import { PRESSABLE_FILL_ICON_STATE_CLASS } from "../../../../shared/styles/buttonStateStyles";

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
        <span className="flex h-6 w-6 items-center justify-center rounded-full">
          <CreditIcon size={20} />
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
          type="ai"
          onClick={onRequestReadabilityCheck}
          disabled={disabled}
          className="h-8 px-4 py-2 text-[13px] leading-4.5 font-medium"
        >
          <CreditIcon
            size={16}
            className={PRESSABLE_FILL_ICON_STATE_CLASS}
          />
          AI 읽힘 점검하기
        </Button>
      </div>
    </section>
  );
};

export default DraftReadabilityCard;
