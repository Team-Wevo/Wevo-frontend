import { CreditIcon } from "../../../../../shared/components/icons";
import { PRESSABLE_FILL_ICON_STATE_CLASS } from "../../../../../shared/styles/buttonStateStyles";
import { Button } from "../../../../../shared/components/Button";

interface CloseCollectionModalProps {
  opinionCount: number;
  isClosing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const CloseCollectionModal = ({
  opinionCount,
  isClosing = false,
  onCancel,
  onConfirm,
}: CloseCollectionModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={isClosing ? undefined : onCancel}
    >
      <div
        className="flex w-110 flex-col gap-5 overflow-hidden rounded-[16px] bg-gray-50 p-6 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-[18px] leading-7 font-semibold text-black">
            의견 수집을 마감할까요?
          </h2>
          <p className="text-[13px] leading-5 font-normal text-gray-700">
            예진 님이 아직 의견을 작성 중이에요.
            <br />
            마감하면 현재 제출된 의견 {opinionCount}개로 AI 정리를 시작하며,
            추가 작성과 수정은 중단돼요.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="transparent"
            onClick={onCancel}
            disabled={isClosing}
            className="text-xs leading-4 font-medium"
          >
            조금 더 기다리기
          </Button>
          <Button
            type="ai"
            onClick={onConfirm}
            disabled={isClosing}
            className="text-xs leading-4 font-medium"
          >
            <CreditIcon
              size={14}
              className={PRESSABLE_FILL_ICON_STATE_CLASS}
            />
            {isClosing ? "마감 중..." : "마감하고 AI 정리 시작"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CloseCollectionModal;
