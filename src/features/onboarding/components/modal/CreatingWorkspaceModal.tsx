import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";

const CreatingWorkspaceModal = () => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent px-4">
      <div
        className="inline-flex w-full max-w-[384px] flex-col items-center gap-6 overflow-hidden rounded-2xl bg-gray-50 p-8 shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)]"
        onClick={(event) => event.stopPropagation()}
      >
        <LoadingSpinner size={80} />

        <div className="flex flex-col items-center gap-2">
          <div className="text-center text-xl leading-8 font-semibold text-gray-900">
            최적의 작업보드를 생성 중이에요
          </div>
          <div className="text-center text-sm leading-5 font-normal text-gray-700">
            작성 흐름에 맞춰 섹션을 준비하고 있어요
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatingWorkspaceModal;
