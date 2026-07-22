import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          페이지를 찾을 수 없어요.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          요청하신 주소가 올바르지 않거나, 페이지가 이동되었어요.
        </p>

        <Link
          to="/"
          className="bg-main-600 mt-6 inline-flex rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
