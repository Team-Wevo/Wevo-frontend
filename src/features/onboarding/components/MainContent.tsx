import { useState } from "react";
import PromptInput from "./PromptInput";
import SuggestionTags from "./SuggestionTags";
import CreateFlowModal from "./modal/CreateFlowModal";

const MainContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    "proposal" | "presentation" | null
  >(null);
  const [ideaFromPromptInput, setIdeaFromPromptInput] = useState("");
  const [modalOpenKey, setModalOpenKey] = useState(0);

  const handleSubmitPrompt = (value: string) => {
    setIdeaFromPromptInput(value);
    setSelectedDocumentType(null);
    setModalOpenKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <main className="relative flex-1 overflow-y-auto bg-slate-50">
      {/* 고정 인사말 */}
      <div className="absolute top-65 left-1/2 z-10 w-[576px] -translate-x-1/2 text-center">
        <p className="text-3xl leading-10 font-bold tracking-tight text-slate-900">
          안녕하세요, 지현구 님
        </p>

        <p className="text-md mt-2 leading-7 font-semibold text-slate-500">
          무엇을 만들까요? 자유롭게 적어주세요.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="mx-auto flex w-full max-w-[576px] flex-col pt-[350px]">
        <PromptInput onSubmit={handleSubmitPrompt} />

        <SuggestionTags
          onSelectDocumentType={(documentType) => {
            setIdeaFromPromptInput("");
            setSelectedDocumentType(documentType);
            setModalOpenKey((prev) => prev + 1);
            setIsModalOpen(true);
          }}
        />
      </div>

      <CreateFlowModal
        key={modalOpenKey}
        isOpen={isModalOpen}
        initialDocumentType={selectedDocumentType}
        initialIdea={ideaFromPromptInput}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default MainContent;
