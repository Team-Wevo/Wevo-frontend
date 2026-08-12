import { EditNameIcon } from "../../../shared/components/icons";
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
    <div className="flex w-full flex-col items-start gap-6 overflow-hidden rounded-lg border border-gray-200 bg-white px-10 pt-10 pb-8">
      <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
        <span className="bg-main-50 text-main-700 rounded-[6px] px-2.5 py-[5px] text-[11px] leading-[14px] font-normal">
          완성본 미리보기
        </span>
        <h1 className="text-[28px] leading-[38px] font-semibold text-gray-900">
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
            className="group relative w-full overflow-hidden rounded-sm"
          >
            {/* 보라색 조각은 왼쪽에서 8px만 차지하는 작은 고정폭 사각형이라, 흰 박스와
                가장자리를 공유하지 않아 서브픽셀 반올림으로 오른쪽에 삐져나오는 문제가 없다.
                흰 박스는 translate-x로 밀려나면서 그중 3px만 드러낸다 — translate는 레이아웃
                너비를 바꾸지 않아 hover 시 텍스트 줄바꿈이 절대 바뀌지 않는다
                (overflow-hidden이 안전망). */}
            <div className="bg-main-600 absolute inset-y-0 left-0 w-2 opacity-0 group-hover:opacity-100" />
            <div className="relative flex translate-x-0 flex-col items-start gap-3 rounded-sm p-4 transition-transform duration-150 group-hover:translate-x-[3px] group-hover:bg-gray-100">
              <div className="flex w-full items-center justify-between overflow-hidden">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-main-600 text-[13px] leading-5 font-normal">
                    {String(section.orderNo).padStart(2, "0")}
                  </span>
                  <span className="text-lg leading-7 font-semibold text-gray-900">
                    {section.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onEditSection?.(section.orderNo)}
                  className="flex shrink-0 cursor-pointer items-center gap-1 overflow-hidden rounded-[6px] border border-transparent px-[9px] py-[5px] group-hover:border-gray-400 group-hover:bg-gray-50"
                >
                  <EditNameIcon size={14} />
                  <span className="text-xs leading-4 font-medium text-gray-600">
                    수정
                  </span>
                </button>
              </div>
              <p
                className={cn(
                  "w-full text-sm leading-[22px] font-normal",
                  section.content ? "text-gray-700" : "text-gray-600",
                )}
              >
                {section.content ?? "작성된 내용이 없습니다."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedPreviewCard;
