import { useMemo, useState } from "react";
import { Button } from "../../../../shared/components/Button";
import SectionBlock from "../blocks/SectionBlock";
import DraftReadabilityCard from "./DraftReadabilityCard";
import type { DraftEditingMode, DraftStageViewProps } from "./types";
import { CreditIcon } from "../../../../shared/components/icons";

const DraftEditingView = ({
  state,
  onOpenEvidence,
  onFinishEditing,
  onRequestReadabilityCheck,
}: DraftStageViewProps) => {
  const defaultMode = state.editingMeta?.defaultMode ?? "self";
  const [editingMode, setEditingMode] = useState<DraftEditingMode>(defaultMode);

  const editorName = state.editingMeta?.currentEditorName ?? "팀원";
  const myDisplayName = state.editingMeta?.myDisplayName ?? "내";
  const isSelfEditing = editingMode === "self";

  const helperMessage = useMemo(() => {
    if (isSelfEditing) {
      return "초안 편집을 마치면 읽힘 점검을 진행할 수 있어요.";
    }

    return "현재 초안 편집이 끝난 뒤 점검할 수 있어요.";
  }, [isSelfEditing]);

  return (
    <>
      <div className="flex items-center gap-2 rounded-sm border border-dashed border-gray-400 bg-gray-50 p-2">
        <span className="text-xs leading-4 font-medium text-gray-700">
          편집 상태 확인 (개발용)
        </span>
        <Button
          type={isSelfEditing ? "main" : "outline"}
          onClick={() => setEditingMode("self")}
          className="h-7 px-3 py-1 text-xs"
        >
          내가 편집 중
        </Button>
        <Button
          type={!isSelfEditing ? "main" : "outline"}
          onClick={() => setEditingMode("locked")}
          className="h-7 px-3 py-1 text-xs"
        >
          다른 사람이 편집 중
        </Button>
      </div>

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
            defaultValue={state.draftContent ?? ""}
            aria-label="초안 편집 영역"
          />
        ) : (
          <div className="h-48 overflow-y-auto text-base leading-6 font-normal text-gray-900">
            {state.draftContent}
          </div>
        )}
      </SectionBlock>

      {isSelfEditing ? (
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-success text-xs leading-4 font-medium">
              ✓
            </span>
            <span className="text-xs leading-4 font-normal text-gray-600">
              자동 저장됨
            </span>
          </div>
          <button
            type="button"
            className="text-main-700 text-xs leading-5 font-normal"
            onClick={onOpenEvidence}
          >
            근거 보기
          </button>
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

      <DraftReadabilityCard
        description={helperMessage}
        disabled={true}
        onRequestReadabilityCheck={onRequestReadabilityCheck}
      />
    </>
  );
};

export default DraftEditingView;
