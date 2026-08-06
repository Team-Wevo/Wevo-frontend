import { useState } from "react";
import { useMyProfile } from "../../auth/hooks/useMyProfile";
import PromptInput from "./PromptInput";
import SuggestionTags from "./SuggestionTags";
import CreateFlowModal from "./modal/CreateFlowModal";

interface MainContentProps {
  isLoggedIn?: boolean;
}

const MainContent = ({ isLoggedIn = false }: MainContentProps) => {
  const { data: profile } = useMyProfile(isLoggedIn);
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
      {/* 인사말 + 입력 영역을 한 블록으로 묶어 화면 중앙에 배치한다.
          두 상태 모두 제목 1줄 + 부제 1줄이라 블록 높이가 같아, 입력창 위치도 동일하게 유지된다. */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="mb-6 text-center">
            {isLoggedIn ? (
              <>
                <p className="text-3xl leading-10 font-bold tracking-tight text-slate-900">
                  안녕하세요{profile?.name ? `, ${profile.name} 님` : ""}
                </p>

                <p className="text-md mt-2 leading-7 font-semibold text-slate-500">
                  무엇을 만들까요? 자유롭게 적어주세요.
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl leading-10 font-bold tracking-tight text-slate-900">
                  함께 만드는 문서, Wevo에서 시작하세요.
                </p>

                <p className="text-md mt-2 leading-7 font-semibold text-slate-500">
                  만들고 싶은 내용을 자유롭게 적어주세요.
                </p>
              </>
            )}
          </div>

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
