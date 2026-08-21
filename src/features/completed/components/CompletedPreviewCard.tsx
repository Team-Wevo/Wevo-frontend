import { EditNameIcon } from "../../../shared/components/icons";
import { Button } from "../../../shared/components/Button";
import MarkdownContent from "../../../shared/components/MarkdownContent";
import { PRESSABLE_STROKE_ICON_STATE_CLASS } from "../../../shared/styles/buttonStateStyles";
import { cn } from "../../../shared/utils/cn";

export interface CompletedPreviewSection {
  orderNo: number;
  title: string;
  content: string | null;
}

interface CompletedPreviewCardProps {
  categoryLabel: string;
  documentTitle: string;
  sections: CompletedPreviewSection[];
  onEditSection?: (orderNo: number) => void;
}

const CompletedPreviewCard = ({
  categoryLabel,
  documentTitle,
  sections,
  onEditSection,
}: CompletedPreviewCardProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-6 overflow-hidden rounded-lg border border-gray-200 bg-white px-5 pt-6 pb-8 md:px-10 md:pt-10">
      <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
        <span className="bg-main-50 text-main-700 rounded-[6px] px-2.5 py-[5px] text-[11px] leading-[14px] font-normal">
          완성본 미리보기
        </span>
        <h1 className="text-[28px] leading-[38px] font-semibold break-words text-gray-900">
          {documentTitle}
        </h1>
        <p className="text-[13px] leading-5 font-normal text-gray-600">
          {categoryLabel} · {sections.length}개 섹션
        </p>
      </div>

      <div className="h-px w-full shrink-0 bg-gray-200" />

      <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
        {sections.map((section) => (
          <div
            key={section.orderNo}
            data-completed-section={section.orderNo}
            className="relative w-full scroll-mt-8 overflow-hidden rounded-sm"
          >
            <div className="relative flex flex-col items-start gap-3 rounded-sm p-4 transition-colors hover:bg-gray-100">
              <div className="flex w-full items-center justify-between gap-2 overflow-hidden">
                <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                  <span className="text-main-600 shrink-0 text-[13px] leading-5 font-normal">
                    {String(section.orderNo).padStart(2, "0")}
                  </span>
                  <span className="truncate text-lg leading-7 font-semibold text-gray-900">
                    {section.title}
                  </span>
                </div>
                <Button
                  type="draftEdit"
                  onClick={() => onEditSection?.(section.orderNo)}
                  className="h-auto shrink-0 gap-1 overflow-hidden rounded-[6px] px-[9px] py-[5px] text-xs leading-4 font-medium"
                >
                  <EditNameIcon
                    size={14}
                    className={PRESSABLE_STROKE_ICON_STATE_CLASS}
                  />
                  <span>수정</span>
                </Button>
              </div>
              {section.content ? (
                <MarkdownContent
                  content={section.content}
                  className="w-full text-sm leading-[22px] text-gray-700"
                />
              ) : (
                <p
                  className={cn(
                    "w-full text-sm leading-[22px] font-normal text-gray-600",
                  )}
                >
                  작성된 내용이 없습니다.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedPreviewCard;
