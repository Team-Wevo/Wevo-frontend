import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "알 수 없는 오류가 발생했어요.";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-red-500">Error</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          페이지를 불러오는 중 문제가 발생했어요.
        </h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
