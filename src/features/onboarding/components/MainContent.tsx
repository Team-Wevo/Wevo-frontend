import { useState } from "react";
import PromptInput from "./PromptInput";
import SuggestionTags from "./SuggestionTags";
import CreateFlowModal from "./modal/CreateFlowModal";

const MainContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    "proposal" | "presentation" | "free"
  >("proposal");
  return (
    <main className="relative flex-1 overflow-y-auto bg-slate-50">
      {/* 고정 인사말 */}
      <div className="absolute top-65 left-1/2 z-10 w-[576px] -translate-x-1/2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          안녕하세요, 지현구 님
        </h1>

        <p className="mt-2 text-xs font-medium text-slate-500">
          무엇을 만들까요? 자유롭게 적어주세요.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="mx-auto flex w-full max-w-[576px] flex-col pt-[345px]">
        <PromptInput />

        <SuggestionTags
          onSelectDocumentType={(documentType) => {
            setSelectedDocumentType(documentType);
            setIsModalOpen(true);
          }}
        />

        <p className="mt-4 text-center text-[10px] font-medium tracking-wide text-slate-400">
          Pro로 시작하면 AI에게 더 많이 물어볼 수 있으며 자세한 섹션 구조를
          만들어 줍니다.
        </p>
      </div>

      <CreateFlowModal
        isOpen={isModalOpen}
        initialDocumentType={selectedDocumentType}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default MainContent;
