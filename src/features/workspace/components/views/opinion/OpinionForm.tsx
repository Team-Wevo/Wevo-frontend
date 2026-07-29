import { useState } from "react";
import { Button } from "../../../../../shared/components/Button";

const MAX_OPINION_LENGTH = 1000;

interface OpinionFormProps {
  onSubmit: (opinion: string) => void;
}

const OpinionForm = ({ onSubmit }: OpinionFormProps) => {
  const [opinion, setOpinion] = useState("");

  const handleSubmit = () => {
    // TODO: 의견 제출 API 연동. 지금은 API가 없어서 요청 상태와 무관하게 바로 제출 완료 처리.
    onSubmit(opinion);
  };

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
          placeholder="의견을 입력해주세요."
          className="flex-1 resize-none text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        <div className="flex items-center justify-end gap-3">
          <span className="text-xs text-gray-600">
            {opinion.length} / {MAX_OPINION_LENGTH}
          </span>
          <Button
            type="transparent"
            onClick={handleSubmit}
            disabled={opinion.trim().length === 0}
            className="bg-gray-100 px-6 py-2 text-gray-600"
          >
            제출하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpinionForm;
