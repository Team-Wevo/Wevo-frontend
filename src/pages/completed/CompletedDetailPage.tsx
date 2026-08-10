import { useParams } from "react-router-dom";
import CompletedLayout from "../../app/layouts/CompletedLayout";
import type { DocumentProgress } from "../../shared/types/documentType";

// TODO: 로더 연동 후 실제 섹션 진행 상황으로 교체
const MOCK_PROGRESS: DocumentProgress = [
  { section: "제안 배경", status: "작성 완료" },
  { section: "문제 및 필요성", status: "작성 완료" },
  { section: "목표 및 제안 범위", status: "작성 완료" },
  { section: "제안 내용", status: "작성 완료" },
  { section: "실행 방안", status: "작성 완료" },
  { section: "기대 효과", status: "작성 완료" },
];

// TODO: 실제 완료된 프로젝트 상세 페이지 구현 시 children 영역을 교체하세요.
export const CompletedDetailPage = () => {
  const { id } = useParams();

  return (
    <CompletedLayout
      title="완성본"
      projectId={id ?? ""}
      progress={MOCK_PROGRESS}
      activeStepId={1}
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          CompletedDetailPage
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          임시 placeholder 페이지입니다.
        </p>
        <p className="mt-1 text-sm text-slate-500">프로젝트 ID: {id}</p>
      </div>
    </CompletedLayout>
  );
};

export default CompletedDetailPage;
