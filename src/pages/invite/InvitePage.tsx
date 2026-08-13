import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMainLayoutContext } from "../../app/layouts/mainLayoutContext";
import {
  getJoinProjectErrorMessage,
  joinProjectByInvite,
} from "../../features/project/api/invite";
import { savePostLoginRedirect } from "../../features/auth/utils/postLoginRedirect";
import { Button } from "../../shared/components/Button";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";

const CARD_CLASS =
  "w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm";

const InvitePage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { isLoggedIn, openLoginModal } = useMainLayoutContext();
  const hasStartedJoiningRef = useRef(false);
  const [isJoining, setIsJoining] = useState(isLoggedIn);
  const [joinAttempt, setJoinAttempt] = useState(0);
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !token || hasStartedJoiningRef.current) return;

    hasStartedJoiningRef.current = true;
    setIsJoining(true);
    setJoinErrorMessage(null);

    joinProjectByInvite(token)
      .then((result) => {
        navigate(`/workspace/${result.projectId}`, { replace: true });
      })
      .catch((error) => {
        setJoinErrorMessage(getJoinProjectErrorMessage(error));
        setIsJoining(false);
      });
  }, [isLoggedIn, joinAttempt, navigate, token]);

  const handleLogin = () => {
    savePostLoginRedirect(`/invite/${token}`);
    openLoginModal();
  };

  const handleRetryJoin = () => {
    hasStartedJoiningRef.current = false;
    setJoinErrorMessage(null);
    setIsJoining(true);
    setJoinAttempt((previous) => previous + 1);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className={CARD_CLASS}>
          <h1 className="text-lg leading-7 font-semibold text-gray-900">
            유효하지 않은 초대 링크예요
          </h1>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className={CARD_CLASS}>
          <h1 className="text-lg leading-7 font-semibold text-gray-900">
            초대를 확인하려면 로그인이 필요해요
          </h1>
          <p className="mt-3 text-sm leading-5.5 font-normal text-gray-700">
            로그인 후 다시 이 링크로 들어오면 프로젝트 정보를 볼 수 있어요.
          </p>
          <Button
            type="main"
            onClick={handleLogin}
            className="mt-6 h-11 w-full"
          >
            <span>로그인</span>
          </Button>
        </div>
      </div>
    );
  }

  if (isJoining && !joinErrorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-6">
        <LoadingSpinner size={80} />
        <p className="text-sm leading-5.5 font-normal text-gray-700">
          프로젝트에 참여하고 작업 보드로 이동하고 있어요.
        </p>
      </div>
    );
  }

  if (joinErrorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className={CARD_CLASS}>
          <h1 className="text-lg leading-7 font-semibold text-gray-900">
            프로젝트에 참여하지 못했어요
          </h1>
          <p className="text-error mt-4 text-sm leading-6">
            {joinErrorMessage}
          </p>
          <Button
            type="main"
            onClick={handleRetryJoin}
            className="mt-6 h-11 w-full"
          >
            <span>다시 시도</span>
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default InvitePage;
