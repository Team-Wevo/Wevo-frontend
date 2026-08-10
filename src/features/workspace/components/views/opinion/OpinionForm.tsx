import { useState } from "react";
import { Button } from "../../../../../shared/components/Button";
import {
  saveOpinionDraft,
  submitOpinion,
  getSaveOpinionDraftErrorMessage,
  getSubmitOpinionErrorMessage,
} from "../../../api/submitOpinion";

const MAX_OPINION_LENGTH = 1000;
const MIN_SUBMIT_LENGTH = 20;

interface OpinionFormProps {
  sectionId: number;
  onSubmit: () => void;
}

const OpinionForm = ({ sectionId, onSubmit }: OpinionFormProps) => {
  const [opinion, setOpinion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
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
            type="transparent"
            onClick={handleSubmit}
            disabled={isBelowMinLength || isSubmitting}
            className="bg-gray-100 px-6 py-2 text-gray-600"
          >
            {isSubmitting ? "제출 중..." : "제출하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpinionForm;
