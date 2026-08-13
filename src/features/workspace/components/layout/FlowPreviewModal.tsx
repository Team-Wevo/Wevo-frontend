import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import MarkdownContent from "../../../../shared/components/MarkdownContent";
import { cn } from "../../../../shared/utils/cn";

export interface FlowPreviewSection {
  sectionNo: number;
  title: string;
  content: string | null;
  isLoading?: boolean;
  errorMessage?: string | null;
}

interface FlowPreviewModalProps {
  documentTitle: string;
  documentTypeLabel: string;
  sections: FlowPreviewSection[];
  initialSectionNo?: number;
  onNavigateToSection: (sectionNo: number) => void;
  onClose: () => void;
}

const FlowPreviewModal = ({
  documentTitle,
  documentTypeLabel,
  sections,
  initialSectionNo = 1,
  onNavigateToSection,
  onClose,
}: FlowPreviewModalProps) => {
  const [activeSectionNo, setActiveSectionNo] = useState(initialSectionNo);
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTargetSectionNoRef = useRef<number | undefined>(undefined);
  const scrollEndTimerRef = useRef<number | undefined>(undefined);

  const writtenCount = sections.filter((section) => section.content).length;

  const handleSelectSection = (sectionNo: number) => {
    setActiveSectionNo(sectionNo);

    const element = sectionRefs.current[sectionNo];

    if (!element) return;

    scrollTargetSectionNoRef.current = sectionNo;
    window.clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = window.setTimeout(() => {
      scrollTargetSectionNoRef.current = undefined;
      scrollEndTimerRef.current = undefined;
    }, 500);
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    const handleScroll = () => {
      const scrollTargetSectionNo = scrollTargetSectionNoRef.current;

      if (scrollTargetSectionNo !== undefined) {
        setActiveSectionNo(scrollTargetSectionNo);

        window.clearTimeout(scrollEndTimerRef.current);
        scrollEndTimerRef.current = window.setTimeout(() => {
          scrollTargetSectionNoRef.current = undefined;
          scrollEndTimerRef.current = undefined;
        }, 120);
        return;
      }

      const containerTop = container.getBoundingClientRect().top;
      let currentSectionNo = sections[0]?.sectionNo;

      for (const section of sections) {
        const element = sectionRefs.current[section.sectionNo];

        if (!element) {
          continue;
        }

        const offsetTop = element.getBoundingClientRect().top - containerTop;

        if (offsetTop <= 24) {
          currentSectionNo = section.sectionNo;
        }
      }

      setActiveSectionNo(currentSectionNo);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.clearTimeout(scrollEndTimerRef.current);
    };
  }, [sections]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="flex h-[640px] w-[1040px] flex-col overflow-hidden rounded-lg border border-[#CDD0DF] bg-white shadow-[0_12px_40px_0_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between px-6 py-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[16px] leading-7 font-normal text-gray-900">
              전체 흐름 미리보기
            </h2>
            <p className="text-[11px] leading-4 font-normal text-gray-600">
              현재 작성된 섹션을 순서대로 확인할 수 있어요
            </p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="flex cursor-pointer items-center gap-1 rounded-sm p-1 text-gray-600"
          >
            <X className="h-5 w-5" />
            <span className="text-[12px]">닫기</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 border-t border-gray-300">
          <nav className="flex w-[224px] flex-col gap-[2px] overflow-y-auto border-r border-gray-300 bg-gray-100/50 px-2 py-3">
            <h3 className="px-3 pb-1 text-[11px] leading-[14px] font-normal text-gray-600">
              섹션
            </h3>
            {sections.map((section) => {
              const isActive = section.sectionNo === activeSectionNo;
              return (
                <button
                  key={section.sectionNo}
                  type="button"
                  onClick={() => handleSelectSection(section.sectionNo)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-left",
                    isActive ? "bg-gray-200" : "hover:bg-gray-100",
                  )}
                >
                  <span className="text-[11px] leading-[14px] font-normal text-gray-600">
                    {section.sectionNo}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-4 font-medium",
                      isActive ? "text-gray-900" : "text-gray-700",
                    )}
                  >
                    {section.title}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            ref={scrollContainerRef}
            className="min-h-0 w-160 flex-1 overflow-y-auto px-8 py-6"
          >
            <div className="mx-auto flex w-[640px] flex-col gap-7 px-8 py-7">
              <div className="flex flex-col gap-1 border-b border-gray-300 pb-5">
                <h1 className="text-[20px] leading-7 font-semibold text-gray-900">
                  {documentTitle}
                </h1>
                <p className="text-[12px] leading-5 font-normal text-gray-600">
                  {documentTypeLabel} · {sections.length}개 섹션 ·{" "}
                  {writtenCount}개 작성됨
                </p>
              </div>

              <div className="flex flex-col gap-8">
                {sections.map((section) => (
                  <div
                    key={section.sectionNo}
                    ref={(element) => {
                      sectionRefs.current[section.sectionNo] = element;
                    }}
                    className="flex flex-col gap-2"
                  >
                    <h3 className="text-base text-[18px] leading-6 font-[600] text-gray-900">
                      {section.sectionNo}. {section.title}
                    </h3>
                    {section.isLoading ? (
                      <div className="flex min-h-24 items-center justify-center rounded-md border border-gray-300 bg-gray-50">
                        <LoadingSpinner size={24} />
                      </div>
                    ) : section.errorMessage ? (
                      <div className="border-error/30 bg-error/5 flex min-h-24 items-center justify-center rounded-md border px-4 py-5 text-center">
                        <p className="text-error text-[12px] leading-5 font-normal">
                          {section.errorMessage}
                        </p>
                      </div>
                    ) : section.content ? (
                      <MarkdownContent
                        content={section.content}
                        className="text-[13px] leading-6 text-gray-700"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-[3px] rounded-md border-2 border-dashed border-gray-400 bg-gray-100/50 px-4 py-5 text-center">
                        <p className="text-[13px] leading-5 font-normal text-gray-600">
                          아직 생성된 초안이 없어요.
                        </p>
                        <p className="text-[12px] leading-5 font-normal text-gray-600">
                          의견을 정리해 초안을 만들면 여기에 표시돼요.
                        </p>
                        <button
                          type="button"
                          onClick={() => onNavigateToSection(section.sectionNo)}
                          className="text-main-500 mt-1 cursor-pointer text-xs leading-4 font-medium"
                        >
                          ↳ 이 섹션으로 이동
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-gray-300 px-6 py-[14px]">
          <p className="text-xs leading-4 font-normal text-gray-600">
            미리보기에서는 내용을 수정할 수 없어요.
          </p>
          <Button
            type="outline"
            onClick={onClose}
            className="text-xs leading-4 font-medium"
          >
            작업으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlowPreviewModal;
