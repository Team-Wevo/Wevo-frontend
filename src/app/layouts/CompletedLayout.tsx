import { useEffect, useRef, useState, type ReactNode } from "react";
import WorkspaceHeader from "../../features/workspace/components/layout/WorkspaceHeader";
import CompletedLeftSidebar, {
  type CompletedNavigationSection,
} from "../../features/completed/components/layout/CompletedLeftSidebar";
import CompletedRightSidebar from "../../features/completed/components/layout/CompletedRightSidebar";
import MobileDrawer from "../../shared/components/MobileDrawer";

interface CompletedLayoutProps {
  title: string;
  projectId: string;
  sections: CompletedNavigationSection[];
  onCopyFullText?: () => void;
  onCopyMarkdown?: () => void;
  onDownloadTxt?: () => void;
  onDownloadMd?: () => void;
  onBackToWorkspace?: () => void;
  isExporting?: boolean;
  actionMessage?: string | null;
  isActionError?: boolean;
  children: ReactNode;
}

// 헤더·왼쪽 사이드바는 워크스페이스와 동일하게 재사용하고, 오른쪽 사이드바만
// 완성본 화면 전용(CompletedRightSidebar)으로 교체한 틀. 스테퍼·온보딩·전체
// 미리보기 모달 등 작성 흐름 전용 UI는 아직 붙이지 않았다.
const CompletedLayout = ({
  title,
  projectId,
  sections,
  onCopyFullText,
  onCopyMarkdown,
  onDownloadTxt,
  onDownloadMd,
  onBackToWorkspace,
  isExporting,
  actionMessage,
  isActionError,
  children,
}: CompletedLayoutProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTargetSectionNoRef = useRef<number | undefined>(undefined);
  const scrollEndTimerRef = useRef<number | undefined>(undefined);
  const [activeSectionNo, setActiveSectionNo] = useState<number>();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const resolvedActiveSectionNo = sections.some(
    (section) => section.orderNo === activeSectionNo,
  )
    ? activeSectionNo
    : sections[0]?.orderNo;

  useEffect(() => {
    const container = contentRef.current;

    if (!container || sections.length === 0) return;

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
      let currentSectionNo = sections[0].orderNo;

      for (const section of sections) {
        const element = container.querySelector<HTMLElement>(
          `[data-completed-section="${section.orderNo}"]`,
        );

        if (!element) continue;

        const offsetTop = element.getBoundingClientRect().top - containerTop;

        if (offsetTop <= 40) {
          currentSectionNo = section.orderNo;
        }
      }

      const isScrollable = container.scrollHeight > container.clientHeight + 2;
      const isAtBottom =
        isScrollable &&
        container.scrollHeight - container.scrollTop - container.clientHeight <=
          2;

      if (isAtBottom) {
        currentSectionNo = sections[sections.length - 1].orderNo;
      }

      setActiveSectionNo(currentSectionNo);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.clearTimeout(scrollEndTimerRef.current);
    };
  }, [sections]);

  const handleSelectSection = (sectionNo: number) => {
    const element = contentRef.current?.querySelector<HTMLElement>(
      `[data-completed-section="${sectionNo}"]`,
    );

    setActiveSectionNo(sectionNo);

    if (!element) return;

    scrollTargetSectionNoRef.current = sectionNo;
    window.clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = window.setTimeout(() => {
      scrollTargetSectionNoRef.current = undefined;
      scrollEndTimerRef.current = undefined;
    }, 500);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <WorkspaceHeader
        title={title}
        projectId={projectId}
        saveStatus="saved"
        canInviteMembers={false}
        showMembers={false}
        onOpenNav={() => setIsNavOpen(true)}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <CompletedLeftSidebar
            sections={sections}
            activeSectionNo={resolvedActiveSectionNo}
            onSelectSection={handleSelectSection}
          />
        </div>

        <div
          ref={contentRef}
          className="flex flex-1 flex-col gap-6 overflow-y-auto bg-gray-100 px-4 py-5 md:px-12 md:py-8 [&>*]:shrink-0"
        >
          {children}
        </div>

        <div className="hidden md:flex">
          <CompletedRightSidebar
            onCopyFullText={onCopyFullText}
            onCopyMarkdown={onCopyMarkdown}
            onDownloadTxt={onDownloadTxt}
            onDownloadMd={onDownloadMd}
            onBackToWorkspace={onBackToWorkspace}
            isExporting={isExporting}
            actionMessage={actionMessage}
            isActionError={isActionError}
          />
        </div>
      </div>

      <MobileDrawer
        open={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        side="left"
        label="섹션 이동"
      >
        <CompletedLeftSidebar
          sections={sections}
          activeSectionNo={resolvedActiveSectionNo}
          onSelectSection={(sectionNo) => {
            setIsNavOpen(false);
            handleSelectSection(sectionNo);
          }}
        />
      </MobileDrawer>

      <MobileDrawer
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        side="right"
        label="내보내기"
      >
        <CompletedRightSidebar
          onCopyFullText={onCopyFullText}
          onCopyMarkdown={onCopyMarkdown}
          onDownloadTxt={onDownloadTxt}
          onDownloadMd={onDownloadMd}
          onBackToWorkspace={onBackToWorkspace}
          isExporting={isExporting}
          actionMessage={actionMessage}
          isActionError={isActionError}
        />
      </MobileDrawer>
    </div>
  );
};

export default CompletedLayout;
