import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "../../../../../shared/components/Button";
import { cn } from "../../../../../shared/utils/cn";
import CloseCollectionModal from "./CloseCollectionModal";

interface CollectedOpinion {
  id: string;
  name: string;
  avatarColor: string;
  content: string;
}

// TODO: 실제 의견 제출 API 연동 후 서버에서 받아온 목록으로 교체
const MOCK_OPINIONS: CollectedOpinion[] = [
  {
    id: "1",
    name: "지현구",
    avatarColor: "bg-main-500",
    content:
      "장학금 정보가 여러 사이트에 흩어져 있어서 찾는 데 시간이 오래 걸려요. 한곳에서 모아보면 좋겠어요.",
  },
  {
    id: "2",
    name: "수빈",
    avatarColor: "bg-blue-500",
    content:
      "공고마다 지원 자격이 달라서 매번 비교하는 게 번거로워요. 자격에 맞는 것만 보여주면 편할 것 같아요.",
  },
  {
    id: "3",
    name: "민수",
    avatarColor: "bg-success",
    content:
      "관심 장학금 마감일을 놓치는 경우가 많아요. 마감을 미리 알려주는 기능이 있으면 좋겠어요.",
  },
];

interface CollectedOpinionsProps {
  onEditOpinion: () => void;
}

const CollectedOpinions = ({ onEditOpinion }: CollectedOpinionsProps) => {
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

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
        모인 의견 {MOCK_OPINIONS.length}개
      </h2>

      <div className="flex flex-col gap-3">
        {MOCK_OPINIONS.map((opinion) => (
          <div
            key={opinion.id}
            className="flex flex-col gap-2 rounded-[12px] border border-gray-400 bg-gray-50 p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[11px] text-gray-50",
                  opinion.avatarColor,
                )}
              >
                {opinion.name[0]}
              </span>
              <span className="text-[13px] font-medium text-gray-700">
                {opinion.name}
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
        <Button
          type="outline"
          className="h-11 text-[18px] leading-[28px] font-semibold"
          onClick={() => setIsCloseConfirmOpen(true)}
        >
          <Sparkles className="h-4 w-4" />
          현재 의견으로 AI 정리 시작
        </Button>
      </div>

      {isCloseConfirmOpen && (
        <CloseCollectionModal
          opinionCount={MOCK_OPINIONS.length}
          onCancel={() => setIsCloseConfirmOpen(false)}
          onConfirm={() => {
            // TODO: AI 정리 시작 API/라우팅 연동
            setIsCloseConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default CollectedOpinions;
