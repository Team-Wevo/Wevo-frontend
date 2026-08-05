import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useRevalidator } from "react-router-dom";
import { Button } from "../../../../../shared/components/Button";
import { cn } from "../../../../../shared/utils/cn";
import CloseCollectionModal from "./CloseCollectionModal";
import {
  closeOpinionGate,
  getCloseOpinionGateErrorMessage,
} from "../../../api/closeOpinionGate";
import type { SectionOpinion } from "../../../api/getSectionOpinions";

const AVATAR_COLORS = ["bg-main-500", "bg-blue-500", "bg-success"];

interface CollectedOpinionsProps {
  projectSectionId: number;
  opinions: SectionOpinion[];
  totalSubmittedCount: number;
  onEditOpinion: () => void;
}

const CollectedOpinions = ({
  projectSectionId,
  opinions,
  totalSubmittedCount,
  onEditOpinion,
}: CollectedOpinionsProps) => {
  const revalidator = useRevalidator();
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closeErrorMessage, setCloseErrorMessage] = useState<string | null>(
    null,
  );

  const handleConfirmClose = async () => {
    setIsClosing(true);
    setCloseErrorMessage(null);

    try {
      await closeOpinionGate(projectSectionId);
      setIsCloseConfirmOpen(false);
      // 마감 성공 시 loader를 다시 실행해 섹션 상태(SYNTHESIZING)를 반영한다.
      await revalidator.revalidate();
    } catch (error) {
      setCloseErrorMessage(getCloseOpinionGateErrorMessage(error));
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-main-50 flex items-center justify-between overflow-hidden rounded-[8px] px-4 py-3">
        <span className="text-main-700 text-xs font-medium">
          ✓ 의견을 제출했어요.
        </span>
        <div className="flex items-center gap-4 text-[13px]">
          <button
            type="button"
            onClick={onEditOpinion}
            className="text-main-700 cursor-pointer font-normal"
          >
            내 의견 수정
          </button>
          {/* TODO: 다른 섹션으로 이동하는 라우팅 연결 */}
          <button
            type="button"
            className="text-main-700 cursor-pointer font-normal"
          >
            다른 섹션 작성
          </button>
        </div>
      </div>

      <h2 className="text-[14px] font-medium text-gray-900">
        모인 의견 {totalSubmittedCount}개
      </h2>

      <div className="flex flex-col gap-3">
        {opinions.map((opinion, index) => (
          <div
            key={opinion.id}
            className="flex flex-col gap-2 rounded-[12px] border border-gray-400 bg-gray-50 p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-gray-50",
                  AVATAR_COLORS[index % AVATAR_COLORS.length],
                )}
              >
                {opinion.author.name[0]}
              </span>
              <span className="text-[13px] font-medium text-gray-700">
                {opinion.author.name}
              </span>
            </div>
            <p className="text-[16px] text-gray-900">{opinion.content}</p>
          </div>
        ))}
      </div>
      <hr className="border-gray-400" />

      <p className="text-[13px] text-gray-700">
        예진 님이 작성 중이에요. 새 의견이 제출되면 여기에 바로 표시돼요.
      </p>

      <div className="flex items-center justify-between">
        {/* TODO: 알림 발송 API 연동 */}
        <Button type="outline">예진에게 알림</Button>
        <div className="flex items-center gap-3">
          {closeErrorMessage && (
            <span className="text-error text-xs">{closeErrorMessage}</span>
          )}
          <Button
            type="outline"
            className="h-11 text-[18px] leading-[28px] font-semibold"
            onClick={() => setIsCloseConfirmOpen(true)}
          >
            <Sparkles className="h-4 w-4" />
            현재 의견으로 AI 정리 시작
          </Button>
        </div>
      </div>

      {isCloseConfirmOpen && (
        <CloseCollectionModal
          opinionCount={totalSubmittedCount}
          isClosing={isClosing}
          onCancel={() => setIsCloseConfirmOpen(false)}
          onConfirm={handleConfirmClose}
        />
      )}
    </div>
  );
};

export default CollectedOpinions;
