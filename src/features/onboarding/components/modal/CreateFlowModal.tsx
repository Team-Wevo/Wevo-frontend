import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MODAL_SCRIM_CLASS } from "@/shared/styles/modalStyles";
import {
  createProject,
  type CreateProjectPayload,
} from "../../../project/api/createProject";
import AudienceSection from "./AudienceSection";
import CreatingWorkspaceModal from "./CreatingWorkspaceModal";
import DocumentTypeSection from "./DocumentTypeSection";
import FooterButton from "./FooterButton";
import IdeaSection from "./IdeaSection";
import WritingFlowModal from "./WritingFlowModal";

const WORKSPACE_NAVIGATION_DELAY_MS = 2000;
const MAX_PROJECT_TITLE_LENGTH = 30;

const DOCUMENT_TYPE_TO_RESULT_TYPE: Record<
  "proposal" | "presentation",
  CreateProjectPayload["resultType"]
> = {
  proposal: "PROPOSAL",
  presentation: "PRESENTATION",
};

const AUDIENCE_LABEL: Record<"judge" | "professor" | "member", string> = {
  judge: "심사위원",
  professor: "교수",
  member: "팀원",
};

// 별도 제목 입력이 없어서 아이디어 텍스트를 축약해 프로젝트 제목으로 사용한다.
const buildProjectTitle = (idea: string) => {
  return idea.length > MAX_PROJECT_TITLE_LENGTH
    ? `${idea.slice(0, MAX_PROJECT_TITLE_LENGTH)}...`
    : idea;
};

interface CreateFlowModalProps {
  isOpen: boolean;
  initialDocumentType: "proposal" | "presentation" | null;
  initialIdea: string;
  onClose: () => void;
}

const CreateFlowModal = ({
  isOpen,
  initialDocumentType,
  initialIdea,
  onClose,
}: CreateFlowModalProps) => {
  const navigate = useNavigate();
  const [idea, setIdea] = useState(initialIdea);
  const [isEditingIdea, setIsEditingIdea] = useState(true);
  const [documentType, setDocumentType] = useState<
    "proposal" | "presentation" | null
  >(initialDocumentType);
  const [audience, setAudience] = useState<
    "judge" | "professor" | "member" | "custom" | null
  >(null);
  const [customAudience, setCustomAudience] = useState("");
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCreatingWorkspace) {
        return;
      }

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
  }, [isOpen, isCreatingWorkspace, isFlowModalOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isReady =
    idea.trim().length >= 10 &&
    Boolean(documentType) &&
    Boolean(audience) &&
    (audience !== "custom" || customAudience.trim().length > 0);

  const handleStartWorkspaceFlow = async () => {
    if (!documentType || !audience || !isReady) {
      return;
    }

    setIsFlowModalOpen(false);
    setIsCreatingWorkspace(true);

    try {
      const trimmedIdea = idea.trim();

      const result = await createProject({
        title: buildProjectTitle(trimmedIdea),
        ideaText: trimmedIdea,
        resultType: DOCUMENT_TYPE_TO_RESULT_TYPE[documentType],
        audience:
          audience === "custom"
            ? customAudience.trim()
            : AUDIENCE_LABEL[audience],
      });

      await new Promise((resolve) => {
        setTimeout(resolve, WORKSPACE_NAVIGATION_DELAY_MS);
      });

      navigate(`/workspace/${result.projectId}/sections/1`);
    } catch {
      setIsCreatingWorkspace(false);
      setIsFlowModalOpen(true);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${MODAL_SCRIM_CLASS}`}
      onClick={() => {
        if (!isCreatingWorkspace) {
          onClose();
        }
      }}
    >
      {/* CreateFlowModal 폼 - isFlowModalOpen이 false일 때만 표시 */}
      {!isFlowModalOpen && !isCreatingWorkspace && (
        <div
          className="w-full max-w-[384px] rounded-[24px] bg-gray-50 p-6 shadow-[0_20px_48px_-8px_rgba(0,0,0,0.12)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm leading-7 font-semibold text-gray-900">
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
      {isFlowModalOpen && documentType && (
        <WritingFlowModal
          isOpen={isFlowModalOpen}
          documentType={documentType}
          onClose={() => setIsFlowModalOpen(false)}
          onStart={handleStartWorkspaceFlow}
        />
      )}

      {isCreatingWorkspace && <CreatingWorkspaceModal />}
    </div>
  );
};

export default CreateFlowModal;
