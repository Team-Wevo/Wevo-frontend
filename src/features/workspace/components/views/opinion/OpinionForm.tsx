import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../../shared/components/Button";
import { cn } from "../../../../../shared/utils/cn";
import {
  saveOpinionDraft,
  submitOpinion,
  getSaveOpinionDraftErrorMessage,
  getSubmitOpinionErrorMessage,
} from "../../../api/submitOpinion";
import type { DraftSaveStatus } from "../../layout/WorkspaceHeader";

const MAX_OPINION_LENGTH = 1000;
const MIN_SUBMIT_LENGTH = 20;
const DRAFT_SAVE_DEBOUNCE_MS = 800;

interface OpinionFormProps {
  sectionId: number;
  initialContent?: string;
  onSubmit: () => void;
  onSaveStatusChange?: (status: DraftSaveStatus) => void;
}

const OpinionForm = ({
  sectionId,
  initialContent = "",
  onSubmit,
  onSaveStatusChange,
}: OpinionFormProps) => {
  const [opinion, setOpinion] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pendingDraftTimerRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);

  // 입력을 멈추고 일정 시간이 지나면 임시저장한다. 타이핑 중엔 "저장 중...",
  // 저장이 실제로 끝난 뒤에만 "저장됨"을 보여준다.
  useEffect(() => {
    // 기존 작업본을 불러와 채운 첫 렌더에서는 저장을 다시 보낼 필요가 없다.
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    // 내용을 전부 지운 경우도 그대로 저장해야 서버의 임시저장본이 비워진다.
    onSaveStatusChange?.("saving");

    pendingDraftTimerRef.current = window.setTimeout(() => {
      saveOpinionDraft(sectionId, opinion)
        .then(() => onSaveStatusChange?.("saved"))
        .catch(() => {
          // 자동 임시저장 실패는 조용히 무시한다. 다음 입력 또는 제출 시 다시 시도된다.
        });
    }, DRAFT_SAVE_DEBOUNCE_MS);

    return () => {
      if (pendingDraftTimerRef.current !== null) {
        window.clearTimeout(pendingDraftTimerRef.current);
      }
    };
  }, [opinion, sectionId, onSaveStatusChange]);

  // 섹션을 벗어나면 상태 표시를 초기화한다.
  useEffect(() => {
    return () => onSaveStatusChange?.("idle");
  }, [onSaveStatusChange]);

  const handleSubmit = async () => {
    if (pendingDraftTimerRef.current !== null) {
      window.clearTimeout(pendingDraftTimerRef.current);
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // submit은 요청 본문을 받지 않으므로, 먼저 임시저장으로 현재 텍스트를
      // 서버에 반영한 뒤 제출을 진행한다.
      await saveOpinionDraft(sectionId, opinion);
    } catch (error) {
      setErrorMessage(getSaveOpinionDraftErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    try {
      await submitOpinion(sectionId);
      onSubmit();
    } catch (error) {
      setErrorMessage(getSubmitOpinionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBelowMinLength = opinion.trim().length < MIN_SUBMIT_LENGTH;

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[14px] font-medium text-gray-900">내 의견</h2>
      <p className="text-[13px] text-gray-600">
        내 의견을 제출하면 현재까지 제출된 팀원의 의견을 확인할 수 있어요.
      </p>

      <div className="mt-2 flex h-[182px] flex-col justify-between rounded-xl border border-gray-400 bg-gray-50 p-4">
        <textarea
          value={opinion}
          onChange={(event) =>
            setOpinion(event.target.value.slice(0, MAX_OPINION_LENGTH))
          }
          placeholder="의견을 입력해주세요. (20자 이상)"
          className="flex-1 resize-none text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        <div className="flex items-center justify-end gap-3">
          {errorMessage && (
            <span className="text-error text-xs">{errorMessage}</span>
          )}
          <span className="text-xs text-gray-600">
            {opinion.length} / {MAX_OPINION_LENGTH}
          </span>
          <Button
            type={isBelowMinLength ? "transparent" : "main"}
            onClick={handleSubmit}
            disabled={isBelowMinLength || isSubmitting}
            className={cn(
              "px-6 py-2",
              isBelowMinLength && "bg-gray-100 text-gray-600",
            )}
          >
            {isSubmitting ? "제출 중..." : "제출하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpinionForm;
