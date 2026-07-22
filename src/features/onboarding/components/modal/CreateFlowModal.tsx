import { X } from "lucide-react";
import { useEffect, useState } from "react";
import AudienceSection from "./AudienceSection";
import DocumentTypeSection from "./DocumentTypeSection";
import FooterButton from "./FooterButton";
import IdeaSection from "./IdeaSection";
import WritingFlowModal from "./WritingFlowModal";

interface CreateFlowModalProps {
  isOpen: boolean;
  initialDocumentType: "proposal" | "presentation" | "free";
  onClose: () => void;
}

const CreateFlowModal = ({
  isOpen,
  initialDocumentType,
  onClose,
}: CreateFlowModalProps) => {
  const [idea, setIdea] = useState("");
  const [isEditingIdea, setIsEditingIdea] = useState(true);
  const [documentType, setDocumentType] = useState<
    "proposal" | "presentation" | "free"
  >(initialDocumentType);
  const [audience, setAudience] = useState<
    "judge" | "professor" | "member" | "custom" | null
  >(null);
  const [customAudience, setCustomAudience] = useState("");
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isFlowModalOpen) {
          setIsFlowModalOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFlowModalOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isReady =
    idea.trim().length >= 10 &&
    Boolean(documentType) &&
    Boolean(audience) &&
    (audience !== "custom" || customAudience.trim().length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onClose}
    >
      {/* CreateFlowModal 폼 - isFlowModalOpen이 false일 때만 표시 */}
      {!isFlowModalOpen && (
        <div
          className="w-full max-w-[384px] rounded-[24px] bg-[#fbfaff] p-6 shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm leading-7 font-normal text-gray-900">
              무엇을 만들지 알려주세요
            </div>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-700 transition-colors hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <IdeaSection
              idea={idea}
              onChange={(value) => {
                setIdea(value);
              }}
              isEditing={isEditingIdea}
              onEditToggle={() => setIsEditingIdea(true)}
              onCompleteEdit={() => setIsEditingIdea(false)}
            />

            <DocumentTypeSection
              value={documentType}
              onChange={setDocumentType}
            />

            <AudienceSection
              value={audience}
              customAudience={customAudience}
              onChange={setAudience}
              onCustomAudienceChange={setCustomAudience}
            />

            <FooterButton
              disabled={!isReady}
              onClick={() => setIsFlowModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* WritingFlowModal - isFlowModalOpen이 true일 때만 표시 */}
      {isFlowModalOpen && (
        <WritingFlowModal
          isOpen={isFlowModalOpen}
          documentType={documentType}
          onClose={() => setIsFlowModalOpen(false)}
          onStart={() => {}}
        />
      )}
    </div>
  );
};

export default CreateFlowModal;
