import { OnBoardingSideBar } from "../shared/OnBoardingSideBar";

import { ArrowUp, ArrowRight, Mic, Pencil, File } from "lucide-react";

export const OnBoardingPage = () => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-800 select-none">
      {/* 1. 좌측 사이드바 조립 */}
      <OnBoardingSideBar />

      {/* 2. 우측 메인 콘텐츠 대시보드 영역 (배경을 데모와 동일한 회색조로 일치) */}
      <main className="flex flex-1 flex-col items-center justify-start overflow-y-auto bg-slate-50 px-8 pt-24 pb-12">
        {/* 타이틀 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            안녕하세요, 지현구 님
          </h1>
          <p className="mt-1.5 text-xs font-medium text-slate-400">
            무엇을 만들까요? 죄송합니다.
          </p>
        </div>

        {/* 메인 입력창 */}
        <div className="flex w-full max-w-[540px] items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 hover:shadow-md">
          <input
            type="text"
            placeholder="예) 일치하는 서비스를 제공하도록 제안합니다."
            className="w-full bg-transparent px-1 text-sm text-slate-800 placeholder-gray-300 outline-none"
          />
          <button className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl bg-gray-100 text-gray-400 transition-all duration-200 hover:bg-indigo-600 hover:text-white">
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 하단 추천 태그 리스트 (Lucide 아이콘으로 전면 교체) */}
        <div className="mt-4 flex items-center gap-2">
          <button className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600">
            <File className="h-3.5 w-3.5 text-blue-500" />
            <span>제안서</span>
          </button>
          <button className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600">
            <Mic className="h-3.5 w-3.5 text-purple-500" />
            <span>발표 구성</span>
          </button>
          <button className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600">
            <Pencil className="h-3.5 w-3.5 text-indigo-500" />
            <span>자유주제</span>
          </button>
        </div>

        {/* 추가 안내 캡션 */}
        <p className="mt-4 text-[10px] font-medium tracking-wide text-slate-400">
          소개로 시작하면 AI가 몇 가지 더 많이 물어보고 섹션 구조를 만들어
          줍니다.
        </p>

        {/* 3. 최근 작업 섹션 */}
        <div className="mt-14 w-full max-w-[400px]">
          <h2 className="mb-4 text-center text-[11px] font-bold tracking-wider text-slate-400">
            최근 작업
          </h2>
          <div className="space-y-3">
            {/* 아이템 1 */}
            <div className="group flex cursor-pointer items-center justify-between rounded-2xl bg-transparent p-2 transition-all hover:bg-white hover:shadow-xs">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  PM Day 발표 준비
                </div>
                <div className="mt-0.5 text-[10px] text-gray-400">
                  인코딩 작성 중
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-1.5 w-16 items-center rounded-full bg-gray-200/60">
                  <div className="h-full w-[40%] rounded-full bg-indigo-500" />
                </div>
                <span className="w-7 text-right text-[10px] font-semibold text-slate-400">
                  40 %
                </span>
                <ArrowRight className="h-3 w-3 text-gray-300 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
            {/* 아이템 2 */}
            <div className="group flex cursor-pointer items-center justify-between rounded-2xl bg-transparent p-2 transition-all hover:bg-white hover:shadow-xs">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  캡스톤 서비스 제안서
                </div>
                <div className="mt-0.5 text-[10px] text-gray-400">
                  아이디어 중
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-1.5 w-16 items-center rounded-full bg-gray-200/60">
                  <div className="h-full w-[15%] rounded-full bg-indigo-500" />
                </div>
                <span className="w-7 text-right text-[10px] font-semibold text-slate-400">
                  15 %
                </span>
                <ArrowRight className="h-3 w-3 text-gray-300 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
            {/* 아이템 3 */}
            <div className="group flex cursor-pointer items-center justify-between rounded-2xl bg-transparent p-2 transition-all hover:bg-white hover:shadow-xs">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  대외활동 기획안
                </div>
                <div className="mt-0.5 text-[10px] text-gray-400">제작 전</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-1.5 w-16 items-center rounded-full bg-gray-200/60">
                  <div className="h-full w-[0%] rounded-full bg-indigo-500" />
                </div>
                <span className="w-7 text-right text-[10px] font-semibold text-slate-400">
                  0 %
                </span>
                <ArrowRight className="h-3 w-3 text-gray-300 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
