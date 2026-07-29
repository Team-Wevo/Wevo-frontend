import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../../shared/utils/cn";
import type {
  DocumentProgress,
  SectionStatusValue,
} from "../../../../shared/types/documentType";
import { Button } from "../../../../shared/components/Button";

const SIDEBAR_STATUS_LABEL: Record<SectionStatusValue, string> = {
  "시작 전": "시작 전",
  "의견 모으기": "작성 중",
  "정리·초안": "작성 중",
  "검토·확정": "작성 중",
  "작성 완료": "작성 완료",
};

interface WorkspaceLeftSidebarProps {
  progress: DocumentProgress;
  activeStepId: number;
  projectId: string;
  onConfirmFinal?: () => void;
}

const WorkspaceLeftSidebar = ({
  progress,
  activeStepId,
  projectId,
  onConfirmFinal,
}: WorkspaceLeftSidebarProps) => {
  const totalCount = progress.length;
  const completedCount = progress.filter(
    (item) => item.status === "작성 완료",
  ).length;

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col justify-between border-r border-gray-400 bg-white px-3 py-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs text-[13px] font-normal text-gray-600">
          작업 흐름
        </h2>

        <nav className="flex flex-col">
          {progress.map((item, index) => {
            const stepId = index + 1;
            const isActive = stepId === activeStepId;
            return (
              // 경로: /workspace/:projectId/sections/:sectionNo
              // - sectionNo(stepId)는 orderNo 기준 1~6이며 projectSectionId가 아님 -
              //   API 호출 시에는 섹션 목록에서 orderNo가 일치하는 항목의 projectSectionId를 사용
              // - phase(의견 모으기/정리·초안/검토·확정)는 URL에 넣지 않고 sectionStatus에 따라
              //   중앙 컴포넌트만 교체
              <Link
                key={item.section}
                to={`/workspace/${projectId}/sections/${stepId}`}
                className={cn(
                  "flex cursor-pointer items-start gap-2 overflow-hidden rounded-sm px-3 py-2 text-left",
                  isActive && "bg-main-50",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 text-xs leading-4 font-medium",
                    isActive ? "text-gray-700" : "text-gray-400",
                  )}
                >
                  {stepId}
                </span>
                <span className="flex flex-1 flex-col items-start gap-1 overflow-hidden">
                  <span
                    className={cn(
                      "text-xs leading-4 font-medium",
                      isActive ? "text-gray-900" : "text-gray-700",
                    )}
                  >
                    {item.section}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-4 font-normal",
                      isActive ? "text-main-600" : "text-gray-600",
                    )}
                  >
                    {SIDEBAR_STATUS_LABEL[item.status]}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>
        <Button
          type="main"
          onClick={onConfirmFinal}
          className="mt-4 h-10 w-full items-center justify-start gap-2 overflow-hidden rounded-sm px-4 py-3 text-xs leading-4 font-medium text-gray-50"
        >
          완성본 확인하기
          <span className="flex items-center gap-1 overflow-hidden text-xs leading-4 font-normal text-gray-50">
            <span>
              {completedCount}/{totalCount}
            </span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default WorkspaceLeftSidebar;
