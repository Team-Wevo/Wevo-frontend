import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import CompletedLayout from "../../app/layouts/CompletedLayout";
import {
  downloadFinalOutput,
  getFinalOutput,
  getFinalOutputContent,
  getFinalOutputErrorMessage,
  type FinalOutputFormat,
} from "../../features/completed/api/finalOutput";
import CompletedPreviewCard, {
  type CompletedPreviewSection,
} from "../../features/completed/components/CompletedPreviewCard";
import EditSectionConfirmModal from "../../features/completed/components/EditSectionConfirmModal";
import { Button } from "../../shared/components/Button";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import type {
  DocumentProgress,
  SectionName,
} from "../../shared/types/documentType";

const RESULT_TYPE_LABEL = {
  PROPOSAL: "제안서",
  PRESENTATION: "발표 구성안",
} as const;

interface ActionStatus {
  message: string;
  isError: boolean;
}

const getSafeFileName = (title: string): string =>
  title.replace(/[\\/:*?"<>|]/g, "_").trim() || "완성본";

export const CompletedDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = Number(id);
  const isValidProjectId = Number.isInteger(projectId) && projectId > 0;
  const [editingSection, setEditingSection] =
    useState<CompletedPreviewSection | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [actionStatus, setActionStatus] = useState<ActionStatus | null>(null);
  const finalOutputQuery = useQuery({
    queryKey: ["final-output", projectId],
    queryFn: () => getFinalOutput(projectId),
    enabled: isValidProjectId,
    retry: false,
  });
  const finalOutput = finalOutputQuery.data;
  const sections: CompletedPreviewSection[] = (finalOutput?.sections ?? [])
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((section) => ({
      orderNo: section.order,
      title: section.title,
      content: section.content.trim() || null,
    }));
  const progress: DocumentProgress = sections.map((section) => ({
    section: section.title as SectionName,
    status: "작성 완료",
  }));

  const handleCancelEdit = () => setEditingSection(null);

  const handleConfirmEdit = () => {
    if (!editingSection) return;
    navigate(`/workspace/${projectId}/sections/${editingSection.orderNo}`);
  };

  const runExportAction = async (
    action: () => Promise<void>,
    successMessage: string,
  ) => {
    if (isExporting) return;

    setIsExporting(true);
    setActionStatus(null);

    try {
      await action();
      setActionStatus({ message: successMessage, isError: false });
    } catch (error) {
      setActionStatus({
        message: getFinalOutputErrorMessage(error),
        isError: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = (format: FinalOutputFormat) => {
    void runExportAction(
      async () => {
        const content = await getFinalOutputContent(projectId, format);
        await navigator.clipboard.writeText(content);
      },
      format === "plain-text"
        ? "전체 텍스트를 복사했어요."
        : "마크다운을 복사했어요.",
    );
  };

  const handleDownload = (format: FinalOutputFormat) => {
    void runExportAction(
      async () => {
        const title = getSafeFileName(finalOutput?.title ?? "완성본");
        const blob = await downloadFinalOutput(projectId, format, title);
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        const extension = format === "plain-text" ? "txt" : "md";

        anchor.href = url;
        anchor.download = `${title}.${extension}`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
      },
      format === "plain-text"
        ? "TXT 파일을 내려받았어요."
        : "MD 파일을 내려받았어요.",
    );
  };

  const content = (() => {
    if (!isValidProjectId) {
      return <p className="text-error text-sm">잘못된 프로젝트 주소입니다.</p>;
    }

    if (finalOutputQuery.isPending) {
      return (
        <div className="flex min-h-96 items-center justify-center">
          <LoadingSpinner size={48} />
        </div>
      );
    }

    if (finalOutputQuery.isError) {
      return (
        <div className="flex min-h-96 flex-col items-center justify-center gap-4">
          <p className="text-error text-sm">
            {getFinalOutputErrorMessage(finalOutputQuery.error)}
          </p>
          <Button
            type="outline"
            onClick={() => void finalOutputQuery.refetch()}
          >
            다시 시도
          </Button>
        </div>
      );
    }

    if (!finalOutput?.ready || sections.length === 0) {
      return (
        <div className="flex min-h-96 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-gray-900">
            아직 완성본을 만들 수 없어요.
          </p>
          <p className="text-xs text-gray-600">
            모든 섹션을 확정하면 완성본이 표시됩니다.
          </p>
        </div>
      );
    }

    return (
      <CompletedPreviewCard
        categoryLabel={RESULT_TYPE_LABEL[finalOutput.resultType]}
        documentTitle={finalOutput.title}
        sections={sections}
        onEditSection={(orderNo) =>
          setEditingSection(
            sections.find((section) => section.orderNo === orderNo) ?? null,
          )
        }
      />
    );
  })();

  return (
    <CompletedLayout
      title="완성본"
      projectId={id ?? ""}
      progress={progress}
      activeStepId={1}
      onCopyFullText={() => handleCopy("plain-text")}
      onCopyMarkdown={() => handleCopy("markdown")}
      onDownloadTxt={() => handleDownload("plain-text")}
      onDownloadMd={() => handleDownload("markdown")}
      onBackToWorkspace={() =>
        navigate(
          `/workspace/${projectId}/sections/${sections[0]?.orderNo ?? 1}`,
        )
      }
      isExporting={isExporting || !finalOutput?.ready}
      actionMessage={actionStatus?.message}
      isActionError={actionStatus?.isError}
    >
      {content}

      {editingSection && (
        <EditSectionConfirmModal
          sectionTitle={editingSection.title}
          onCancel={handleCancelEdit}
          onConfirm={handleConfirmEdit}
        />
      )}
    </CompletedLayout>
  );
};

export default CompletedDetailPage;
