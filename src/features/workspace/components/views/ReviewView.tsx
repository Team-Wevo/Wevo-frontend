import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRevalidator } from "react-router-dom";
import { Button } from "../../../../shared/components/Button";
import { cn } from "../../../../shared/utils/cn";
import SectionBlock from "../blocks/SectionBlock";
import {
  confirmSection,
  getConfirmSectionErrorMessage,
} from "../../api/confirmSection";
import { getUnsatisfiedReasons } from "../../api/getSectionConfirmReadiness";
import { useSectionConfirmReadiness } from "../../hooks/useSectionConfirmReadiness";
import type { WorkspaceSection } from "../../constants/sections";

type SectionReviewStatus = "AGREED" | "CHANGES_REQUESTED" | "PENDING";

interface SectionReviewer {
  id: number;
  name: string;
  avatarColor: string;
  reviewStatus: SectionReviewStatus;
  changeRequestReason?: string;
}

const REVIEW_STATUS_LABEL: Record<SectionReviewStatus, string> = {
  AGREED: "동의",
  CHANGES_REQUESTED: "수정 요청",
  PENDING: "검토 전",
};

const REVIEW_STATUS_TEXT_CLASS: Record<SectionReviewStatus, string> = {
  AGREED: "text-success",
  CHANGES_REQUESTED: "text-error",
  PENDING: "text-gray-600",
};

// TODO: 섹션 검토 현황 API 연동 후 서버 데이터로 교체
const SECTION_REVIEWERS: SectionReviewer[] = [
  { id: 1, name: "수빈", avatarColor: "bg-complete", reviewStatus: "AGREED" },
  {
    id: 2,
    name: "예진",
    avatarColor: "bg-error",
    reviewStatus: "CHANGES_REQUESTED",
    changeRequestReason: "문제 상황을 조금 더 구체화하면 좋겠어요.",
  },
  {
    id: 3,
    name: "민수 · 나",
    avatarColor: "bg-success",
    reviewStatus: "PENDING",
  },
];

// TODO: 프로젝트 멤버 권한 API 연동 후 실제 팀장 여부로 교체
const IS_TEAM_LEADER = true;

const countAgreedReviewers = (reviewers: SectionReviewer[]): number => {
  return reviewers.filter((reviewer) => reviewer.reviewStatus === "AGREED")
    .length;
};

interface ReviewViewProps {
  section: WorkspaceSection;
}

const ReviewView = ({ section }: ReviewViewProps) => {
  const revalidator = useRevalidator();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmErrorMessage, setConfirmErrorMessage] = useState<string | null>(
    null,
  );

  const isSectionConfirmed = section.sectionStatus === "CONFIRMED";

  // 확정 버튼이 있는 화면(팀장 시점 · 확정 전)에서만 조회한다.
  const readinessQuery = useSectionConfirmReadiness(
    section.projectSectionId,
    IS_TEAM_LEADER && !isSectionConfirmed,
  );

  const agreedCount = countAgreedReviewers(SECTION_REVIEWERS);

  const unsatisfiedReasons = getUnsatisfiedReasons(readinessQuery.data);
  // 조회 실패로 조건을 모를 때는 막지 않는다. 확정 시 서버가 다시 검증한다.
  const isConfirmBlocked = readinessQuery.data?.canConfirm === false;
  // 조회 중에는 canConfirm이 낡은 값이므로 중복 확정을 막기 위해 함께 잠근다.
  const isConfirmDisabled =
    isConfirming || readinessQuery.isFetching || isConfirmBlocked;
  const confirmGuideMessage =
    confirmErrorMessage ?? unsatisfiedReasons.join(" ");

  const handleConfirmSection = async () => {
    setIsConfirming(true);
    setConfirmErrorMessage(null);

    try {
      await confirmSection(section.projectSectionId);
      // 확정 성공 시 loader를 다시 실행해 갱신된 섹션 상태를 반영한다.
      // 재검증이 끝날 때까지 기다려야 버튼이 다시 열려 중복 확정 요청이 나가지 않는다.
      await revalidator.revalidate();
    } catch (error) {
      setConfirmErrorMessage(getConfirmSectionErrorMessage(error));
      // 확정 조건이 바뀌었을 수 있으므로 최신 상태를 다시 조회한다.
      void readinessQuery.refetch();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <SectionBlock>
        <div className="text-base leading-6 font-normal text-gray-900">
          최근 대학생의 장학금 수요가 늘고 있으나, 관련 정보는 학교
          홈페이지·장학재단·학과 공지 등 여러 곳에 흩어져 있다. 학생은 자신에게
          맞는 장학금을 찾기 위해 여러 사이트를 오가며 반복적으로 탐색·비교해야
          하고, 이 과정에서 적합한 공고를 놓치거나 마감을 지나치는 경우가 많다.
          이에 흩어진 장학금 정보를 한곳에 모아, 자격 조건에 맞는 장학금을
          비교·안내하는 서비스를 제안한다.
        </div>
      </SectionBlock>

      <div className="flex items-center justify-start gap-2">
        <div className="text-xs leading-4 font-normal text-gray-600">
          근거: 팀 의견 3개 · 확정 결정 1건
          {isSectionConfirmed &&
            ` · 팀 동의 ${agreedCount}/${SECTION_REVIEWERS.length}`}
        </div>
        {/* TODO: 근거 상세 보기 UI 연동 후 onClick 핸들러 연결 */}
        <button
          type="button"
          className="text-main-700 cursor-pointer text-xs leading-5 font-normal"
        >
          근거 보기
        </button>
      </div>

      {isSectionConfirmed ? (
        <>
          <div className="bg-main-50 flex w-full flex-col items-start justify-start gap-4 rounded-xl p-5">
            <div className="flex items-center justify-start gap-1">
              <div className="text-lg leading-7 font-semibold text-green-700">
                ✓
              </div>
              <div className="text-lg leading-7 font-semibold text-gray-900">
                이 섹션을 확정했어요.
              </div>
            </div>
            <div className="text-xs leading-5 font-normal text-gray-700">
              다음 섹션으로 넘어가거나, 필요하면 언제든 다시 열 수 있어요.
            </div>
          </div>

          <div className="flex w-full items-center justify-end">
            {/* TODO: 다음 섹션 경로로 이동하도록 onClick 핸들러 연결 */}
            <Button
              type="main"
              className="h-auto text-lg leading-7 font-semibold"
            >
              다음 섹션 작성하기
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <SectionBlock>
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-full items-center justify-between overflow-hidden">
                <div className="justify-start text-lg leading-7 font-semibold text-gray-900">
                  팀 검토 현황
                </div>
                <div className="justify-start text-xs leading-5 font-normal text-gray-700">
                  동의 {agreedCount}/{SECTION_REVIEWERS.length}
                </div>
              </div>

              <div className="flex w-full flex-col items-start justify-start gap-3">
                {SECTION_REVIEWERS.map((reviewer) => (
                  <div
                    key={reviewer.id}
                    className="flex w-full flex-col gap-2"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center justify-start gap-2">
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full",
                            reviewer.avatarColor,
                          )}
                        >
                          <div className="text-xs leading-4 font-normal text-gray-50">
                            {reviewer.name.charAt(0)}
                          </div>
                        </div>
                        <div className="text-base leading-6 font-normal text-gray-900">
                          {reviewer.name}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "text-xs leading-4 font-medium",
                          REVIEW_STATUS_TEXT_CLASS[reviewer.reviewStatus],
                        )}
                      >
                        {REVIEW_STATUS_LABEL[reviewer.reviewStatus]}
                      </div>
                    </div>

                    {/* 팀장만 수정 요청 사유를 확인하고 처리할 수 있습니다. */}
                    {IS_TEAM_LEADER && reviewer.changeRequestReason && (
                      <div className="flex w-full flex-col items-start justify-start gap-2 rounded-sm bg-amber-100 p-3">
                        <div className="w-full text-xs leading-5 font-normal text-amber-700">
                          “{reviewer.changeRequestReason}”
                        </div>
                        <div className="flex items-center justify-start gap-2">
                          {/* TODO: 초안 수정 / 해결 처리 API 연동 후 onClick 핸들러 연결 */}
                          <Button
                            type="outline"
                            className="text-xs"
                          >
                            초안 수정
                          </Button>
                          <Button
                            type="outline"
                            className="text-xs"
                          >
                            논의 후 해결 처리
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SectionBlock>

          {IS_TEAM_LEADER ? (
            <div className="flex w-full items-end justify-between">
              {confirmGuideMessage && (
                <div
                  className={cn(
                    "text-xs leading-4 font-normal",
                    confirmErrorMessage ? "text-error" : "text-gray-600",
                  )}
                >
                  {confirmGuideMessage}
                </div>
              )}
              <Button
                type="main"
                className="ml-auto h-auto text-lg leading-7 font-semibold"
                onClick={handleConfirmSection}
                disabled={isConfirmDisabled}
              >
                {isConfirming ? "확정 중..." : "섹션 확정"}
              </Button>
            </div>
          ) : (
            <div className="bg-main-50 flex w-full flex-col items-start justify-start gap-3 rounded-xl p-5">
              <div className="text-lg leading-7 font-semibold text-gray-900">
                이 초안, 동의하시나요?
              </div>
              <div className="text-main-700 text-base leading-6 font-normal">
                수정 요청을 선택하면 사유를 남길 수 있어요.
              </div>
              <div className="flex w-full items-center justify-end gap-2">
                <Button type="green">동의</Button>
                <Button type="outline">수정 요청</Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReviewView;
