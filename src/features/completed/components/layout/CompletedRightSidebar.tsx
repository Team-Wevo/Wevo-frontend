import { ArrowDown, ArrowLeft, Copy } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import { cn } from "../../../../shared/utils/cn";

interface CompletedRightSidebarProps {
  onCopyFullText?: () => void;
  onCopyMarkdown?: () => void;
  onDownloadTxt?: () => void;
  onDownloadMd?: () => void;
  onBackToWorkspace?: () => void;
  isExporting?: boolean;
  actionMessage?: string | null;
  isActionError?: boolean;
}

const DIVIDER_CLASS = "h-px w-full shrink-0 bg-gray-200";
const OUTLINE_BUTTON_CLASS =
  "h-auto rounded-sm border-gray-400 bg-white text-gray-900";

// TODO: 복사/다운로드/작업 보드 이동 핸들러를 실제 완성본 데이터·API에 연결
const CompletedRightSidebar = ({
  onCopyFullText,
  onCopyMarkdown,
  onDownloadTxt,
  onDownloadMd,
  onBackToWorkspace,
  isExporting = false,
  actionMessage,
  isActionError = false,
}: CompletedRightSidebarProps) => {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col items-start justify-start gap-6 overflow-hidden border-l border-gray-400 bg-gray-50 px-5 py-6">
      <div className="flex w-full flex-col items-start gap-2.5 overflow-hidden">
        <h2 className="text-base leading-[26px] font-normal text-gray-900">
          활용하기
        </h2>
        <p className="w-full text-xs leading-[15px] font-normal text-gray-600">
          완성된 내용을 필요한 형식으로 가져갈 수 있어요.
        </p>
        <Button
          type="main"
          onClick={onCopyFullText}
          disabled={isExporting}
          className="h-auto w-full gap-1.5 rounded-sm py-[11px] text-[13px] leading-[18px] font-medium"
        >
          <Copy className="h-3 w-3" />
          전체 텍스트 복사
        </Button>
        <Button
          type="outline"
          onClick={onCopyMarkdown}
          disabled={isExporting}
          className={cn(
            OUTLINE_BUTTON_CLASS,
            "w-full gap-1.5 py-[11px] text-[13px] leading-[18px] font-medium",
          )}
        >
          <Copy className="h-3 w-3" />
          마크다운 복사
        </Button>
        {actionMessage && (
          <p
            role="status"
            className={cn(
              "w-full text-xs leading-4",
              isActionError ? "text-error" : "text-success",
            )}
          >
            {actionMessage}
          </p>
        )}
      </div>

      <div className={DIVIDER_CLASS} />

      <div className="flex w-full flex-col items-start gap-2.5 overflow-hidden">
        <h2 className="text-xs leading-4 font-medium text-gray-600">
          다운로드
        </h2>
        <div className="flex w-full items-start gap-2 overflow-hidden">
          <Button
            type="outline"
            onClick={onDownloadTxt}
            disabled={isExporting}
            className={cn(
              OUTLINE_BUTTON_CLASS,
              "flex-1 gap-1 py-2.5 text-xs leading-4 font-medium",
            )}
          >
            <ArrowDown className="h-2.5 w-2.5" />
            TXT
          </Button>
          <Button
            type="outline"
            onClick={onDownloadMd}
            disabled={isExporting}
            className={cn(
              OUTLINE_BUTTON_CLASS,
              "flex-1 gap-1 py-2.5 text-xs leading-4 font-medium",
            )}
          >
            <ArrowDown className="h-2.5 w-2.5" />
            MD
          </Button>
        </div>
      </div>

      <div className={DIVIDER_CLASS} />

      <div className="flex w-full flex-col items-start gap-2.5 overflow-hidden">
        <h2 className="text-[13px] leading-5 font-normal text-gray-900">
          결과물 수정
        </h2>
        <p className="w-full text-xs leading-[15px] font-normal text-gray-600">
          수정할 섹션에 마우스를 올려 ✎ 를 눌러주세요.
        </p>
        <Button
          type="outline"
          onClick={onBackToWorkspace}
          className={cn(
            OUTLINE_BUTTON_CLASS,
            "w-full gap-1.5 py-[11px] text-[13px] leading-[18px] font-medium",
          )}
        >
          <ArrowLeft className="h-3 w-3" />
          작업 보드로 이동
        </Button>
      </div>
    </aside>
  );
};

export default CompletedRightSidebar;
