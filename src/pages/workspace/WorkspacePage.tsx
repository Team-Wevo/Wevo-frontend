import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DEFAULT_WORKSPACE_SECTION,
  WORKSPACE_SECTIONS,
  isWorkspaceSection,
  type WorkspaceSection,
} from "../../features/workspace/constants/sections";

type WorkspaceStep = "opinion" | "draft" | "review";

const WORKSPACE_STEPS: Array<{ key: WorkspaceStep; label: string }> = [
  { key: "opinion", label: "의견 모으기" },
  { key: "draft", label: "정리 초안" },
  { key: "review", label: "검토 확정" },
];

const WorkspacePage = () => {
  const { projectId, section } = useParams();
  const [currentStep, setCurrentStep] = useState<WorkspaceStep>("opinion");

  const currentSection: WorkspaceSection = useMemo(() => {
    if (isWorkspaceSection(section)) {
      return section;
    }
    return DEFAULT_WORKSPACE_SECTION;
  }, [section]);

  const sectionMeta = WORKSPACE_SECTIONS[currentSection];

  return (
    <div className="my-12 px-10 pb-10">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">작업보드</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          {sectionMeta.label}
        </h1>
        <p className="mt-2 text-sm text-slate-500">프로젝트 ID: {projectId}</p>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {WORKSPACE_STEPS.map((step) => (
            <button
              key={step.key}
              type="button"
              onClick={() => setCurrentStep(step.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                currentStep === step.key
                  ? "bg-main-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
          현재 Step:{" "}
          {WORKSPACE_STEPS.find((step) => step.key === currentStep)?.label}
          <br />
          현재 섹션: {sectionMeta.label}
        </div>
      </section>
    </div>
  );
};

export default WorkspacePage;
