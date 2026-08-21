import { Button } from "./Button";

interface GuestPreviewProps {
  title: string;
  /** 한 문장이 한 줄에 그대로 놓이도록 문장 단위로 나눠서 전달한다. */
  descriptions: string[];
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * 비로그인 사용자가 목록 화면을 둘러볼 때, 카드 그리드 자리에 노출되는 안내 영역.
 * ListLayout의 반응형 그리드 안에 들어가므로 전체 폭을 차지하도록 col-span-full을 쓴다.
 */
export const GuestPreview = ({
  title,
  descriptions,
  actionLabel = "로그인하고 시작하기",
  onAction,
}: GuestPreviewProps) => {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 rounded-lg border border-dashed border-gray-400 bg-gray-50 px-6 py-16 text-center">
      <h2 className="text-lg leading-7 font-semibold text-gray-900">{title}</h2>
      <div className="space-y-1">
        {descriptions.map((sentence) => (
          <p
            key={sentence}
            className="text-sm leading-5.5 font-normal text-gray-700"
          >
            {sentence}
          </p>
        ))}
      </div>
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
