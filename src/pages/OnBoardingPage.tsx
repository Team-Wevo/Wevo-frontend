import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 라우터 이동 훅 추가
import { OnBoardingSideBar } from "../shared/OnBoardingSideBar";
import { ArrowUp, Mic, Pencil, File } from "lucide-react";

interface OnBoardingPageProps {
  isLoggedIn?: boolean;
}

export const OnBoardingPage = ({
  isLoggedIn: initialIsLoggedIn = false,
}: OnBoardingPageProps) => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 초기 진입 시 및 라우트 속성 변경 시 로컬스토리지 토큰 유무 동시 검증
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token === "mock-token" || initialIsLoggedIn;
  });

  // 데모 서버 스펙: 로그인 시 mock-token 저장 후 /home으로 이동
  const handleSocialLogin = () => {
    localStorage.setItem("accessToken", "mock-token");
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    navigate("/home"); // 주소창 매핑 유기적 전환
  };

  // 로그아웃 시 토큰 제거 및 루트로 이동
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#F5F6FA] font-sans text-slate-800 select-none">
      {/* 1. 좌측 사이드바 구조 조립 */}
      <OnBoardingSideBar
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />

      {/* 2. 우측 메인 콘텐츠 대시보드 영역 (수직·수평 정중앙 정렬) */}
      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-slate-50 px-8 py-12">
        {/* 타이틀 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            안녕하세요, 지현구 님
          </h1>
          <p className="mt-3.5 text-xs font-medium text-slate-700">
            무엇을 만들까요? 자유롭게 적어주세요.
          </p>
        </div>

        {/* 메인 입력창 */}
        <div className="flex w-full max-w-[576px] items-center justify-between rounded-[16px] border border-gray-200 bg-white p-3 shadow-xs transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 hover:shadow-md">
          <input
            type="text"
            placeholder="예) 일치하는 서비스를 제공하도록 제안합니다."
            className="w-full bg-transparent px-1 text-sm text-slate-800 placeholder-slate-600 outline-none focus:text-slate-900 focus:placeholder-slate-400"
          />
          <button className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl bg-gray-100 text-gray-400 transition-all duration-200 hover:bg-indigo-600 hover:text-white">
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 하단 추천 태그 리스트 */}
        <div className="mt-4 flex items-center gap-2">
          <button className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600">
            <File className="h-3.5 w-3.5 text-blue-500" />
            <span>제안서</span>
          </button>
          <button className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600">
            <Mic className="h-3.5 w-3.5 text-purple-500" />
            <span>발표 구성안</span>
          </button>
          <button className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600">
            <Pencil className="h-3.5 w-3.5 text-indigo-500" />
            <span>자유주제</span>
          </button>
        </div>

        {/* 추가 안내 캡션 */}
        <p className="mt-4 text-[10px] font-medium tracking-wide text-slate-400">
          Pro로 시작하면 AI에게 더 많이 물어볼 수 있으며 자세한 섹션 구조를
          만들어 줍니다.
        </p>
      </main>

      {/* 3. 피그마 코드 기반 소셜 로그인 백드롭 블러 오버레이 */}
      {isLoginModalOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px] duration-200"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="animate-in zoom-in-95 flex w-96 flex-col items-center justify-start gap-5 overflow-hidden rounded-3xl border border-zinc-200 bg-white px-9 py-10 shadow-[0px_12px_48px_0px_rgba(124,111,247,0.14)] duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-start gap-3 self-stretch overflow-hidden">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-indigo-500">
                <span className="text-xl font-bold tracking-tighter text-white">
                  W
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
                onClick={handleSocialLogin}
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
                onClick={handleSocialLogin}
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
      )}
    </div>
  );
};
