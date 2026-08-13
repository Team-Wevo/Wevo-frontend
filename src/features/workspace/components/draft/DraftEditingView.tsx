import { Button } from "../../../../shared/components/Button";
import SectionBlock from "../blocks/SectionBlock";
import DraftReadabilityCard from "./DraftReadabilityCard";
import type { DraftStageViewProps } from "./types";
import { CreditIcon } from "../../../../shared/components/icons";
import MarkdownContent from "../../../../shared/components/MarkdownContent";

const DraftEditingView = ({
  state,
  onOpenEvidence,
  onSaveDraft,
  onFinishEditing,
  onRequestReadabilityCheck,
  onDraftContentChange,
  isSavingDraft,
  draftSaveErrorMessage,
  canRequestReadabilityCheck,
}: DraftStageViewProps) => {
  const defaultMode = state.editingMeta?.defaultMode ?? "self";

  const editorName = state.editingMeta?.currentEditorName ?? "팀원";
  const myDisplayName = state.editingMeta?.myDisplayName ?? "내";
  const isSelfEditing = defaultMode === "self";
  const helperMessage = isSelfEditing
    ? "초안 편집을 마치면 읽힘 점검을 진행할 수 있어요."
    : "현재 초안 편집이 끝난 뒤 점검할 수 있어요.";

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg leading-7 font-semibold text-gray-900">
              섹션 초안 · v{state.version}
            </h2>
            <span className="bg-main-50 text-main-700 flex items-center gap-1 rounded-full px-2 py-1 text-xs leading-4 font-normal">
              <CreditIcon size={12} />
              AI 생성
            </span>
          </div>
        </div>

        <div className="flex w-full items-end justify-between gap-4">
          <p className="text-xs leading-5 font-normal text-gray-600">
            AI가 팀 의견과 쟁점 결정을 반영해 만든 초안이에요.
          </p>

          {isSelfEditing ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span
                  className="text-success text-xs leading-4"
                  aria-hidden
                >
                  ●
                </span>
                <span className="text-xs leading-4 font-medium text-gray-700">
                  {myDisplayName}가 편집 중
                </span>
              </div>
              <Button
                type="main"
                onClick={onSaveDraft}
                className="h-7 rounded-sm px-3 py-1.5 text-xs leading-4 font-medium"
                disabled={isSavingDraft}
              >
                편집 저장
              </Button>
              <Button
                type="outline"
                onClick={onFinishEditing}
                className="h-7 rounded-sm px-3 py-1.5 text-xs leading-4 font-medium"
              >
                편집 종료
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span
                className="text-success text-xs leading-4"
                aria-hidden
              >
                ●
              </span>
              <span className="text-xs leading-5 font-normal text-gray-700">
                {editorName} 님 편집 중
              </span>
            </div>
          )}
        </div>
      </div>

      <SectionBlock
        className={isSelfEditing ? "border-main-600 border-[1.5px]" : ""}
      >
        {isSelfEditing ? (
          <textarea
            className="h-48 w-full resize-none bg-transparent text-base leading-6 font-normal text-gray-900 outline-none"
            value={state.draftContent ?? ""}
            onChange={(event) => onDraftContentChange?.(event.target.value)}
            aria-label="초안 편집 영역"
          />
        ) : (
          <MarkdownContent
            content={state.draftContent ?? ""}
            className="h-48 overflow-y-auto"
          />
        )}
      </SectionBlock>

      {isSelfEditing ? (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <span
              className={`${draftSaveErrorMessage ? "text-error" : "text-success"} text-xs leading-4 font-medium`}
            >
              {draftSaveErrorMessage ? "!" : "✓"}
            </span>
            <span
              className={`${draftSaveErrorMessage ? "text-error" : "text-gray-600"} text-xs leading-4 font-normal`}
            >
              {isSavingDraft
                ? "편집 내용 저장 중..."
                : draftSaveErrorMessage
                  ? draftSaveErrorMessage
                  : "편집 저장 버튼을 눌러 변경 내용을 저장해 주세요."}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-main-700 text-xs leading-5 font-normal"
              onClick={onOpenEvidence}
            >
              근거 보기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between">
          <p className="text-xs leading-4 font-normal text-gray-600">
            {editorName} 님이 편집을 마치면 초안을 수정할 수 있어요.
          </p>
          <button
            type="button"
            className="text-main-700 text-xs leading-5 font-normal"
            onClick={onOpenEvidence}
          >
            근거 보기
          </button>
        </div>
      )}

      {canRequestReadabilityCheck && (
        <DraftReadabilityCard
          description={helperMessage}
          disabled={true}
          onRequestReadabilityCheck={onRequestReadabilityCheck}
        />
      )}
    </>
  );
};

export default DraftEditingView;
