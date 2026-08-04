import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElementRef.current?.focus();
    };
  }, [onClose]);

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px] duration-200"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        className="animate-in zoom-in-95 relative flex w-[400px] flex-col items-center gap-6 overflow-hidden rounded-lg bg-white p-8 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)] duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-[22px] right-8 flex size-5 cursor-pointer items-center justify-center text-gray-600"
          aria-label="로그인 창 닫기"
        >
          <X
            className="size-5"
            strokeWidth={1.5}
          />
        </button>

        <div className="flex w-full flex-col items-center gap-2 overflow-hidden">
          <img
            src="/Wevo-logo.svg"
            alt="Wevo"
            className="size-12 shrink-0"
          />
          <h2
            id="login-modal-title"
            className="w-full text-center text-lg leading-7 font-semibold text-[#171A23]"
          >
            Wevo에 로그인
          </h2>
        </div>

        <div className="flex w-full flex-col items-start gap-3 overflow-hidden">
          <button
            type="button"
            onClick={onKakaoLogin}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-[14px] overflow-hidden rounded-sm bg-[#FEE500] px-4"
          >
            <div className="flex size-[18px] shrink-0 items-center justify-center overflow-hidden">
              <img
                src="/kakao_icon.png"
                alt="Kakao Logo"
                className="size-[18px] object-contain"
              />
            </div>
            <span className="text-[13px] leading-[18px] font-medium whitespace-nowrap text-[#171A23]">
              카카오로 시작하기
            </span>
          </button>

          <button
            type="button"
            onClick={onGoogleLogin}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-sm border border-gray-400 bg-gray-50 px-4"
          >
            <div className="flex size-[18px] shrink-0 items-center justify-center overflow-hidden bg-white">
              <img
                src="/google_icon.jpg"
                alt="Google Logo"
                className="size-[18px] object-contain"
              />
            </div>
            <span className="text-[13px] leading-[18px] font-medium whitespace-nowrap text-gray-900">
              Google로 시작하기
            </span>
          </button>
        </div>

        <p className="w-full text-center text-[11px] leading-[14px] font-normal text-gray-700">
          계속하면 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다
        </p>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-xs leading-[15px] font-normal text-gray-500 transition-colors hover:text-gray-700 active:text-gray-700"
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
