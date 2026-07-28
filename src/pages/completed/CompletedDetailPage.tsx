import { useParams } from "react-router-dom";

// TODO: 실제 완료된 프로젝트 상세 페이지 구현 시 이 파일을 교체하세요.
export const CompletedDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800">
        CompletedDetailPage
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        임시 placeholder 페이지입니다.
      </p>
      <p className="mt-1 text-sm text-slate-500">프로젝트 ID: {id}</p>
    </div>
  );
};

export default CompletedDetailPage;
