import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useNavigate, useRevalidator } from "react-router-dom";
import { Button } from "../../../../shared/components/Button";
import { EditNameIcon } from "../../../../shared/components/icons";
import { PRESSABLE_STROKE_ICON_STATE_CLASS } from "../../../../shared/styles/buttonStateStyles";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import MarkdownContent from "../../../../shared/components/MarkdownContent";
import { cn } from "../../../../shared/utils/cn";
import { getAvatarColorByIndex } from "../../../../shared/utils/avatarColor";
import SectionBlock from "../blocks/SectionBlock";
import DraftEvidenceFooter from "../draft/DraftEvidenceFooter";
import DraftEvidenceModal from "../draft/DraftEvidenceModal";
import {
  confirmSection,
  getConfirmSectionErrorMessage,
} from "../../api/confirmSection";
import { getUnsatisfiedReasons } from "../../api/getSectionConfirmReadiness";
import { getSectionDraftErrorMessage } from "../../api/getSectionDraft";
import {
  getSectionDraftEvidence,
  getSectionDraftEvidenceErrorMessage,
} from "../../api/getSectionDraftEvidence";
import { useSectionConfirmReadiness } from "../../hooks/useSectionConfirmReadiness";
import { useSectionDraft } from "../../hooks/useSectionDraft";
import { useTeamReviews } from "../../hooks/useTeamReviews";
import {
  getTeamReviewsErrorMessage,
  type TeamReviewStatus,
} from "../../api/getTeamReviews";
import {
  CHANGE_REQUEST_REASON_MAX_LENGTH,
  getSubmitTeamReviewErrorMessage,
  submitTeamReview,
  type SubmitTeamReviewStatus,
} from "../../api/submitTeamReview";
import {
  getResolveTeamReviewErrorMessage,
  resolveTeamReview,
} from "../../api/resolveTeamReview";
import type { WorkspaceSection } from "../../constants/sections";
import type { WorkspacePermissions } from "../../utils/getWorkspacePermissions";

const REVIEW_STATUS_LABEL: Record<TeamReviewStatus, string> = {
  APPROVED: "동의",
  CHANGES_REQUESTED: "수정 요청",
  PENDING: "대기",
};

const REVIEW_STATUS_TEXT_CLASS: Record<TeamReviewStatus, string> = {
  APPROVED: "text-success",
  CHANGES_REQUESTED: "text-error",
  PENDING: "text-gray-600",
};

interface ReviewViewProps {
  section: WorkspaceSection;
  sectionId: number;
  permissions: WorkspacePermissions;
  projectId: string;
  // 마지막 섹션이면 null.
  nextSectionNo: number | null;
}

const ReviewView = ({
  section,
  sectionId,
  permissions,
  projectId,
  nextSectionNo,
}: ReviewViewProps) => {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmErrorMessage, setConfirmErrorMessage] = useState<string | null>(
    null,
  );
  const [isChangeRequestMode, setIsChangeRequestMode] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [changeRequestReason, setChangeRequestReason] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submitReviewErrorMessage, setSubmitReviewErrorMessage] = useState<
    string | null
  >(null);
  const [resolvingReviewId, setResolvingReviewId] = useState<number | null>(
    null,
  );
  // 어떤 검토에서 실패했는지 함께 담아 해당 행에만 문구를 노출한다.
  const [resolveError, setResolveError] = useState<{
    reviewId: number;
    message: string;
  } | null>(null);

  const isSectionConfirmed = section.sectionStatus === "CONFIRMED";

  // 확정 버튼이 있는 화면(팀장 시점 · 확정 전)에서만 조회한다.
  const readinessQuery = useSectionConfirmReadiness(
    section.projectSectionId,
    permissions.canConfirmSection && !isSectionConfirmed,
  );

  const teamReviewsQuery = useTeamReviews(section.projectSectionId);
  const teamReviews = teamReviewsQuery.data;

  const draftQuery = useSectionDraft(sectionId);
  const draftEvidenceQuery = useQuery({
    queryKey: [
      "workspace-draft-evidence",
      sectionId,
      draftQuery.data?.contentVersion,
    ],
    queryFn: () => getSectionDraftEvidence(sectionId),
    enabled: Boolean(draftQuery.data),
    retry: false,
  });

  const unsatisfiedReasons = getUnsatisfiedReasons(readinessQuery.data);
  // 조회 실패로 조건을 모를 때는 막지 않는다. 확정 시 서버가 다시 검증한다.
  const isConfirmBlocked = readinessQuery.data?.canConfirm === false;
  // 조회 중에는 canConfirm이 낡은 값이므로 중복 확정을 막기 위해 함께 잠근다.
  const isConfirmDisabled =
    isConfirming || readinessQuery.isFetching || isConfirmBlocked;
  const confirmGuideMessage =
    confirmErrorMessage ?? unsatisfiedReasons.join(" ");

  const trimmedChangeRequestReason = changeRequestReason.trim();
  // 제출 직후 재조회 중에는 contentVersion이 낡은 값이라 중복 제출을 막는다.
  const isReviewSubmitDisabled =
    isSubmittingReview || teamReviewsQuery.isFetching || !teamReviews;

  const handleConfirmSection = async () => {
    if (!permissions.canConfirmSection) {
      return;
    }

    setIsConfirming(true);
    setConfirmErrorMessage(null);

    try {
      await confirmSection(sectionId);
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

  const handleSubmitReview = async (status: SubmitTeamReviewStatus) => {
    if (!permissions.canSubmitTeamReview || !teamReviews) {
      return;
    }

    setIsSubmittingReview(true);
    setSubmitReviewErrorMessage(null);

    try {
      await submitTeamReview(sectionId, {
        status,
        changeRequestReason:
          status === "CHANGES_REQUESTED"
            ? trimmedChangeRequestReason
            : undefined,
        // 읽는 사이 본문이 바뀌었으면 서버가 409로 거부한다.
        contentVersion: teamReviews.currentContentVersion,
      });

      setIsChangeRequestMode(false);
      setChangeRequestReason("");
    } catch (error) {
      setSubmitReviewErrorMessage(getSubmitTeamReviewErrorMessage(error));
    } finally {
      // 성공하면 내 검토 결과를, 실패하면 바뀐 본문 버전을 다시 받아온다.
      await teamReviewsQuery.refetch();
      setIsSubmittingReview(false);
    }
  };

  const handleResolveReview = async (reviewId: number) => {
    if (!permissions.canResolveTeamReview) {
      return;
    }

    setResolvingReviewId(reviewId);
    setResolveError(null);

    try {
      await resolveTeamReview(sectionId, reviewId, { resolved: true });
    } catch (error) {
      setResolveError({
        reviewId,
        message: getResolveTeamReviewErrorMessage(error),
      });
    } finally {
      // 미해결 수정 요청 수가 바뀌면 확정 조건(NO_UNRESOLVED_REQUEST)도 함께 달라진다.
      await Promise.all([teamReviewsQuery.refetch(), readinessQuery.refetch()]);
      setResolvingReviewId(null);
    }
  };

  return (
    <>
      <SectionBlock>
        {draftQuery.isPending ? (
          <div className="flex w-full justify-center py-2">
            <LoadingSpinner size={24} />
          </div>
        ) : draftQuery.isError ? (
          <div className="text-error text-xs leading-4 font-normal">
            {getSectionDraftErrorMessage(draftQuery.error)}
          </div>
        ) : (
          <MarkdownContent content={draftQuery.data.content} />
        )}
      </SectionBlock>

      {draftEvidenceQuery.data ? (
        <DraftEvidenceFooter
          evidence={{
            teamOpinionCount: draftEvidenceQuery.data.opinions.length,
            issueDecisionCount: draftEvidenceQuery.data.decisions.length,
            issueDecisionLabel: "확정 결정",
          }}
          suffix={
            isSectionConfirmed && teamReviews
              ? ` · 팀 동의 ${teamReviews.approvedCount}/${teamReviews.totalMembers}`
              : null
          }
          onOpenEvidence={() => setIsEvidenceModalOpen(true)}
        />
      ) : (
        <div className="flex min-h-8 items-center gap-2">
          {draftEvidenceQuery.isPending ? (
            <LoadingSpinner size={16} />
          ) : (
            <span className="text-error text-xs leading-4">
              {getSectionDraftEvidenceErrorMessage(draftEvidenceQuery.error)}
            </span>
          )}
        </div>
      )}

      {isSectionConfirmed && teamReviewsQuery.isError && (
        <div className="text-error text-xs leading-4 font-normal">
          {getTeamReviewsErrorMessage(teamReviewsQuery.error)}
        </div>
      )}

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

          {/* 마지막 섹션에는 넘어갈 곳이 없어 버튼을 두지 않는다. */}
          {nextSectionNo !== null && (
            <div className="flex w-full items-center justify-end">
              <Button
                type="main"
                className="h-auto text-lg leading-7 font-semibold"
                onClick={() =>
                  navigate(`/workspace/${projectId}/sections/${nextSectionNo}`)
                }
              >
                다음 섹션 작성하기
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <SectionBlock>
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-full items-center justify-between overflow-hidden">
                <div className="justify-start text-lg leading-7 font-semibold text-gray-900">
                  팀 검토 현황
                </div>
                {teamReviews && (
                  <div className="justify-start text-xs leading-5 font-normal text-gray-700">
                    동의 {teamReviews.approvedCount}/{teamReviews.totalMembers}
                  </div>
                )}
              </div>

              {teamReviewsQuery.isPending && (
                <div className="flex w-full justify-center py-2">
                  <LoadingSpinner size={24} />
                </div>
              )}

              {teamReviewsQuery.isError && (
                <div className="text-error text-xs leading-4 font-normal">
                  {getTeamReviewsErrorMessage(teamReviewsQuery.error)}
                </div>
              )}

              <div className="flex w-full flex-col items-start justify-start gap-3">
                {teamReviews?.items.map((reviewer, index) => {
                  // 파생 PENDING 항목에는 reviewId가 없어 해소 처리 대상이 아니다.
                  const reviewId = reviewer.reviewId;

                  return (
                    <div
                      key={reviewer.reviewerUserId}
                      className="flex w-full flex-col gap-2"
                    >
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center justify-start gap-2">
                          <div
                            className={cn(
                              "flex size-6 items-center justify-center rounded-full",
                              getAvatarColorByIndex(index),
                            )}
                          >
                            <div className="text-xs leading-4 font-normal text-gray-50">
                              {reviewer.reviewerName.charAt(0)}
                            </div>
                          </div>
                          <div className="text-base leading-6 font-normal text-gray-900">
                            {reviewer.reviewerName}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "text-xs leading-4 font-medium",
                            REVIEW_STATUS_TEXT_CLASS[reviewer.status],
                          )}
                        >
                          {REVIEW_STATUS_LABEL[reviewer.status]}
                        </div>
                      </div>

                      {/* 팀장만 수정 요청 사유를 확인하고 처리할 수 있습니다. */}
                      {permissions.canResolveTeamReview &&
                        reviewer.changeRequestReason && (
                          <div className="flex w-full flex-col items-start justify-start gap-2 rounded-sm bg-amber-100 p-3">
                            <div className="w-full text-xs leading-5 font-normal text-amber-700">
                              “{reviewer.changeRequestReason}”
                            </div>
                            {reviewer.resolved ? (
                              <div className="text-xs leading-4 font-medium text-amber-700">
                                대화로 해결 처리한 요청이에요.
                              </div>
                            ) : (
                              <div className="flex items-center justify-start gap-2">
                                {/* TODO: 초안 수정 API 연동 후 onClick 핸들러 연결 */}
                                <Button
                                  type="draftEdit"
                                  className="h-8 gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] leading-[18px] font-medium"
                                >
                                  <EditNameIcon
                                    size={14}
                                    className={
                                      PRESSABLE_STROKE_ICON_STATE_CLASS
                                    }
                                  />
                                  초안 수정
                                </Button>
                                {reviewId !== undefined && (
                                  <Button
                                    type="outline"
                                    className="text-xs"
                                    onClick={() =>
                                      handleResolveReview(reviewId)
                                    }
                                    disabled={resolvingReviewId !== null}
                                  >
                                    {resolvingReviewId === reviewId
                                      ? "처리 중..."
                                      : "논의 후 해결 처리"}
                                  </Button>
                                )}
                              </div>
                            )}

                            {resolveError &&
                              resolveError.reviewId === reviewId && (
                                <div className="text-error text-xs leading-4 font-normal">
                                  {resolveError.message}
                                </div>
                              )}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionBlock>

          {permissions.isOwner ? (
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

              {isChangeRequestMode && (
                <div className="flex w-full flex-col items-end gap-2">
                  <textarea
                    value={changeRequestReason}
                    onChange={(event) =>
                      setChangeRequestReason(event.target.value)
                    }
                    maxLength={CHANGE_REQUEST_REASON_MAX_LENGTH}
                    rows={3}
                    placeholder="어떤 점을 수정하면 좋을지 적어주세요."
                    className="w-full resize-none rounded-sm border border-gray-400 bg-gray-50 p-3 text-xs leading-5 font-normal text-gray-900 placeholder:text-gray-500"
                  />
                  <div className="text-xs leading-4 font-normal text-gray-600">
                    {trimmedChangeRequestReason.length}/
                    {CHANGE_REQUEST_REASON_MAX_LENGTH}
                  </div>
                </div>
              )}

              {submitReviewErrorMessage && (
                <div className="text-error text-xs leading-4 font-normal">
                  {submitReviewErrorMessage}
                </div>
              )}

              <div className="flex w-full items-center justify-end gap-2">
                {isChangeRequestMode ? (
                  <>
                    <Button
                      type="outline"
                      onClick={() => {
                        setIsChangeRequestMode(false);
                        setChangeRequestReason("");
                        setSubmitReviewErrorMessage(null);
                      }}
                      disabled={isSubmittingReview}
                    >
                      취소
                    </Button>
                    <Button
                      type="main"
                      onClick={() => handleSubmitReview("CHANGES_REQUESTED")}
                      disabled={
                        isReviewSubmitDisabled || !trimmedChangeRequestReason
                      }
                    >
                      {isSubmittingReview ? "제출 중..." : "수정 요청 제출"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="green"
                      onClick={() => handleSubmitReview("APPROVED")}
                      disabled={isReviewSubmitDisabled}
                    >
                      {isSubmittingReview ? "제출 중..." : "동의"}
                    </Button>
                    <Button
                      type="outline"
                      onClick={() => {
                        setIsChangeRequestMode(true);
                        setSubmitReviewErrorMessage(null);
                      }}
                      disabled={isReviewSubmitDisabled}
                    >
                      수정 요청
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {isEvidenceModalOpen && (
        <DraftEvidenceModal
          data={draftEvidenceQuery.data}
          isLoading={draftEvidenceQuery.isPending}
          errorMessage={
            draftEvidenceQuery.isError
              ? getSectionDraftEvidenceErrorMessage(draftEvidenceQuery.error)
              : null
          }
          onClose={() => setIsEvidenceModalOpen(false)}
        />
      )}
    </>
  );
};

export default ReviewView;
