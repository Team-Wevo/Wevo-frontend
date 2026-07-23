export interface ProjectInfoItem {
  label: string;
  value: string;
}

interface WorkspaceRightSidebarProps {
  projectInfo: ProjectInfoItem[];
}

const WorkspaceRightSidebar = ({ projectInfo }: WorkspaceRightSidebarProps) => {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col items-start justify-start gap-6 overflow-hidden border-l border-gray-400 bg-gray-50 px-5 py-6">
      <div className="flex w-full flex-col items-start justify-start gap-3 overflow-hidden">
        <h2 className="text-xs leading-4 font-medium text-gray-700">
          프로젝트 정보
        </h2>
        {projectInfo.map((item) => (
          <div
            key={item.label}
            className="flex w-full flex-col items-start justify-start gap-1 overflow-hidden"
          >
            <div className="text-xs leading-4 font-normal text-gray-600">
              {item.label}
            </div>
            <div className="text-xs leading-5 font-normal text-gray-900">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-2 overflow-hidden">
        <h2 className="text-xs leading-4 font-medium text-gray-700">
          현재 섹션의 참고 내용
        </h2>
        <div className="bg-main-50 flex w-full flex-col items-start justify-start overflow-hidden rounded-sm p-3">
          <div className="w-full text-[13px] leading-5 font-normal text-gray-700">
            이 섹션은 프로젝트 정보를 바탕으로 작성해 주세요.
          </div>
        </div>
      </div>
    </aside>
  );
};

export default WorkspaceRightSidebar;
