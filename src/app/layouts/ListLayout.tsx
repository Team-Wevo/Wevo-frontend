import { Outlet } from "react-router-dom";

const ListLayout = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">
            프로젝트 목록
          </h1>
          <p className="text-sm text-slate-500">
            진행 중인 프로젝트와 완료된 프로젝트를 확인하세요.
          </p>
        </div>
      </header>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ListLayout;
