import { Button } from "../../../shared/components/Button";

interface EditSectionConfirmModalProps {
  sectionTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const EditSectionConfirmModal = ({
  sectionTitle,
  onCancel,
  onConfirm,
}: EditSectionConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20"
      onClick={onCancel}
    >
      <div
        className="flex w-[440px] flex-col items-start gap-3.5 overflow-hidden rounded-lg bg-white px-7 pt-7 pb-6 shadow-[0px_16px_44px_-6px_rgba(23,26,41,0.22)]"
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[15px] leading-[22px] text-[#E8912D]">⚠</span>
          <h2 className="text-lg leading-[26px] font-bold text-gray-900">
            이 섹션을 수정할까요?
          </h2>
        </div>

        <p className="w-96 text-sm leading-[23px] font-normal text-gray-700">
          '{sectionTitle}'는 확정된 섹션이에요.
          <br />
          수정하면 확정이 해제돼요.
        </p>

        <div className="flex w-full items-center justify-end gap-2 overflow-hidden">
          <Button
            type="outline"
            onClick={onCancel}
            className="h-auto rounded-sm px-[18px] py-2.5 text-[13px] leading-[18px] font-medium"
          >
            취소
          </Button>
          <Button
            type="main"
            onClick={onConfirm}
            className="h-auto rounded-sm px-[18px] py-2.5 text-[13px] leading-[18px] font-medium"
          >
            수정하러 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditSectionConfirmModal;
