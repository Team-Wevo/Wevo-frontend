import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  let title = "알 수 없는 오류가 발생했어요";
  let message = "잠시 후 다시 시도해 주세요.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} 오류`;
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F5F6FA] p-6">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
