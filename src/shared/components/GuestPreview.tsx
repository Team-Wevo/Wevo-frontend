import { Button } from "./Button";

interface GuestPreviewProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * 비로그인 사용자가 목록 화면을 둘러볼 때, 카드 그리드 자리에 노출되는 안내 영역.
 * ListLayout의 4열 그리드 안에 들어가므로 전체 폭을 차지하도록 col-span-4를 쓴다.
 */
export const GuestPreview = ({
  title,
  description,
  actionLabel = "로그인하고 시작하기",
  onAction,
}: GuestPreviewProps) => {
  return (
    <div className="col-span-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-gray-400 bg-gray-50 px-6 py-16 text-center">
      <h2 className="text-lg leading-7 font-semibold text-gray-900">{title}</h2>
      <p className="max-w-[520px] text-sm leading-[22px] font-normal text-gray-700">
        {description}
      </p>
      {onAction && (
        <Button
          type="main"
          onClick={onAction}
          className="mt-3"
        >
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default GuestPreview;
