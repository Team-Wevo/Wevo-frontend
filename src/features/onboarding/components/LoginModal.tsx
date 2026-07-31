import { useCallback } from "react";

interface LoginModalProps {
  onClose: () => void;
  onGoogleLogin: () => void;
  onKakaoLogin: () => void;
}

const LoginModal = ({
  onClose,
  onGoogleLogin,
  onKakaoLogin,
}: LoginModalProps) => {
  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px] duration-200"
      onClick={handleOverlayClick}
    >
      <div
        className="animate-in zoom-in-95 flex w-96 flex-col items-center justify-start gap-5 overflow-hidden rounded-3xl border border-zinc-200 bg-white px-9 py-10 shadow-[0px_12px_48px_0px_rgba(124,111,247,0.14)] duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-start gap-3 self-stretch overflow-hidden">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-indigo-500">
            <span className="text-xl font-bold tracking-tighter text-white">
              <img
                src="/Wevo-logo.svg"
                alt="Logo"
                className="h-12 w-12 stroke-[2.5]"
              />
            </span>
          </div>
          <div className="justify-start font-['Noto_Sans_KR'] text-xl font-bold text-neutral-800">
            로그인
          </div>
          <div className="justify-start font-['Noto_Sans_KR'] text-sm font-normal text-slate-500">
            함께 만드는 팀 프로젝트, Wevo
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-2.5 self-stretch overflow-hidden">
          <button
            onClick={onKakaoLogin}
            className="flex h-12 cursor-pointer items-center justify-center gap-2 self-stretch overflow-hidden rounded-2xl bg-yellow-300 transition-opacity hover:bg-yellow-400"
          >
            <div className="flex h-4 w-4 items-center justify-center">
              <img
                src="/kakao_icon.png"
                alt="Kakao Logo"
                className="h-4 w-4"
              />
            </div>
            <div className="justify-start font-['Noto_Sans_KR'] text-base font-medium text-zinc-900">
              카카오로 시작하기
            </div>
          </button>

          <button
            onClick={onGoogleLogin}
            className="flex h-12 cursor-pointer items-center justify-center gap-2 self-stretch overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:bg-slate-50"
          >
            <div className="flex h-4 w-4 items-center justify-center">
              <img
                src="/google_icon.jpg"
                alt="Google Logo"
                className="h-4 w-4"
              />
            </div>
            <div className="justify-start font-['Noto_Sans_KR'] text-base font-medium text-neutral-800">
              Google로 시작하기
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
