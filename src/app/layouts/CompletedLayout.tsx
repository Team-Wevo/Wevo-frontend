import type { ReactNode } from "react";
import WorkspaceHeader from "../../features/workspace/components/layout/WorkspaceHeader";
import WorkspaceLeftSidebar from "../../features/workspace/components/layout/WorkspaceLeftSidebar";
import CompletedRightSidebar from "../../features/completed/components/layout/CompletedRightSidebar";
import type { DocumentProgress } from "../../shared/types/documentType";

interface CompletedLayoutProps {
  title: string;
  projectId: string;
  progress: DocumentProgress;
  activeStepId: number;
  children: ReactNode;
}

// 헤더·왼쪽 사이드바는 워크스페이스와 동일하게 재사용하고, 오른쪽 사이드바만
// 완성본 화면 전용(CompletedRightSidebar)으로 교체한 틀. 스테퍼·온보딩·전체
// 미리보기 모달 등 작성 흐름 전용 UI는 아직 붙이지 않았다.
const CompletedLayout = ({
  title,
  projectId,
  progress,
  activeStepId,
  children,
}: CompletedLayoutProps) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      <WorkspaceHeader
        title={title}
        projectId={projectId}
        isSaved={true}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceLeftSidebar
          progress={progress}
          activeStepId={activeStepId}
          projectId={projectId}
        />

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-gray-100 px-12 py-8 [&>*]:shrink-0">
          {children}
        </div>

        <CompletedRightSidebar />
      </div>
    </div>
  );
};

export default CompletedLayout;
