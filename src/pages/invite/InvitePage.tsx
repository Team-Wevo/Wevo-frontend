import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMainLayoutContext } from "../../app/layouts/mainLayoutContext";
import {
  getInvitePreview,
  getInvitePreviewErrorMessage,
  getJoinProjectErrorMessage,
  joinProjectByInvite,
  type InvitePreviewResponse,
} from "../../features/project/api/invite";
import { Button } from "../../shared/components/Button";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";

const CARD_CLASS =
  "w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm";

const InvitePage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { isLoggedIn, openLoginModal } = useMainLayoutContext();

  const [preview, setPreview] = useState<InvitePreviewResponse | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(isLoggedIn);
  const [previewErrorMessage, setPreviewErrorMessage] = useState<string | null>(
    null,
  );
  const [isJoining, setIsJoining] = useState(false);
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 비로그인 상태에서 호출하면 401 인터셉터가 홈으로 강제 이동시키므로 요청하지 않는다.
    if (!isLoggedIn || !token) return;

    let isCancelled = false;

    getInvitePreview(token)
      .then((response) => {
        if (isCancelled) return;
        setPreview(response);
      })
      .catch((error) => {
        if (isCancelled) return;
        setPreviewErrorMessage(getInvitePreviewErrorMessage(error));
      })
      .finally(() => {
        if (isCancelled) return;
        setIsLoadingPreview(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isLoggedIn, token]);

  const handleJoin = async () => {
    if (!token) return;

    setIsJoining(true);
    setJoinErrorMessage(null);

    try {
      const result = await joinProjectByInvite(token);
      navigate(`/workspace/${result.projectId}/sections/1`, {
        replace: true,
      });
    } catch (error) {
      setJoinErrorMessage(getJoinProjectErrorMessage(error));
      setIsJoining(false);
    }
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
            onClick={openLoginModal}
            className="mt-6 h-11 w-full"
          >
            <span>로그인</span>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingPreview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <LoadingSpinner size={80} />
      </div>
    );
  }

  if (previewErrorMessage || !preview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className={CARD_CLASS}>
          <h1 className="text-lg leading-7 font-semibold text-gray-900">
            초대 링크를 확인할 수 없어요
          </h1>
          <p className="text-error mt-4 text-sm leading-6">
            {previewErrorMessage ?? "잠시 후 다시 시도해주세요."}
          </p>
          <Button
            type="main"
            onClick={() => navigate("/", { replace: true })}
            className="mt-6 h-11 w-full"
          >
            <span>홈으로 이동</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className={CARD_CLASS}>
        <h1 className="text-lg leading-7 font-semibold text-gray-900">
          {preview.projectTitle}
        </h1>
        <p className="mt-3 text-sm leading-5.5 font-normal text-gray-700">
          현재 {preview.memberCount}명이 참여 중이에요.
        </p>
        {preview.full && (
          <p className="text-error mt-2 text-sm leading-6">
            프로젝트 정원이 가득 찼어요.
          </p>
        )}
        {joinErrorMessage && (
          <p className="text-error mt-2 text-sm leading-6">
            {joinErrorMessage}
          </p>
        )}
        <Button
          type="main"
          onClick={handleJoin}
          disabled={preview.full || isJoining}
          className="mt-6 h-11 w-full"
        >
          <span>{isJoining ? "참여하는 중..." : "참여하기"}</span>
        </Button>
      </div>
    </div>
  );
};

export default InvitePage;
