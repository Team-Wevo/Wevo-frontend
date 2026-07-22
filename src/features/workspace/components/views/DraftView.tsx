import type { WorkspaceSection } from "../../constants/sections";

interface DraftViewProps {
  section: WorkspaceSection;
}

const DraftView = ({ section }: DraftViewProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium text-slate-500">정리·초안</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">
        {section.title} 초안을 정리합니다.
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        SYNTHESIZING 또는 DRAFTING 상태에서 이 화면을 렌더링합니다.
      </p>
    </section>
  );
};

export default DraftView;
