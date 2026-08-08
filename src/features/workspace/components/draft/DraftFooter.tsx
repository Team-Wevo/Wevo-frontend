import { Button } from "../../../../shared/components/Button";
import { CreditIcon } from "../../../../shared/components/icons";
import { PRESSABLE_FILL_ICON_STATE_CLASS } from "../../../../shared/styles/buttonStateStyles";

interface DraftFooterProps {
  canRequestReview: boolean;
  onRequestReview?: () => void;
}

const DraftFooter = ({
  canRequestReview,
  onRequestReview,
}: DraftFooterProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <p className="text-xs leading-4 font-normal text-gray-600">
        초안을 다듬은 뒤 AI 사전 검토를 받아보세요.
      </p>
      <Button
        type="ai"
        disabled={!canRequestReview}
        onClick={onRequestReview}
        className="h-10 px-4 py-2 text-base leading-6 font-semibold"
      >
        <CreditIcon
          size={16}
          className={PRESSABLE_FILL_ICON_STATE_CLASS}
        />
        AI 사전 검토 받기
      </Button>
    </div>
  );
};

export default DraftFooter;
