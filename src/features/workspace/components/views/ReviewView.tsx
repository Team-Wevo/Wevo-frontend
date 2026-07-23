import type { WorkspaceSection } from "../../constants/sections";

interface ReviewViewProps {
  section: WorkspaceSection;
}

const ReviewView = ({ section }: ReviewViewProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium text-slate-500">검토·확정</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">
        {section.title} 내용을 최종 검토합니다.
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        REVIEWING 또는 COMPLETED 상태에서 이 화면을 렌더링합니다.
      </p>
    </section>
  );
};

export default ReviewView;
