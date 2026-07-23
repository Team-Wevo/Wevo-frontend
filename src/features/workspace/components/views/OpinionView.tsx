import type { WorkspaceSection } from "../../constants/sections";

interface OpinionViewProps {
  section: WorkspaceSection;
}

const OpinionView = ({ section }: OpinionViewProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium text-slate-500">의견 모으기</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">
        {section.title}에 대한 아이디어를 수집합니다.
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        현재 섹션의 상태는 COLLECTING이며, URL은 유지됩니다.
      </p>
    </section>
  );
};

export default OpinionView;
