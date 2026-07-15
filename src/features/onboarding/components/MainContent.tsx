import PromptInput from "./PromptInput";
import SuggestionTags from "./SuggestionTags";

const MainContent = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-slate-50 px-8 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          안녕하세요, 지현구 님
        </h1>
        <p className="mt-3.5 text-xs font-medium text-slate-700">
          무엇을 만들까요? 자유롭게 적어주세요.
        </p>
      </div>

      <PromptInput />
      <SuggestionTags />

      <p className="mt-4 text-[10px] font-medium tracking-wide text-slate-400">
        Pro로 시작하면 AI에게 더 많이 물어볼 수 있으며 자세한 섹션 구조를 만들어
        줍니다.
      </p>
    </main>
  );
};

export default MainContent;
