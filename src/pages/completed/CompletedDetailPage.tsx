import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompletedLayout from "../../app/layouts/CompletedLayout";
import CompletedPreviewCard, {
  type CompletedPreviewSection,
} from "../../features/completed/components/CompletedPreviewCard";
import EditSectionConfirmModal from "../../features/completed/components/EditSectionConfirmModal";
import type { DocumentProgress } from "../../shared/types/documentType";

// TODO: 로더 연동 후 실제 섹션 진행 상황으로 교체
const MOCK_PROGRESS: DocumentProgress = [
  { section: "제안 배경", status: "작성 완료" },
  { section: "문제 및 필요성", status: "작성 완료" },
  { section: "목표 및 제안 범위", status: "작성 완료" },
  { section: "제안 내용", status: "작성 완료" },
  { section: "실행 방안", status: "작성 완료" },
  { section: "기대 효과", status: "작성 완료" },
];

// TODO: 로더 연동 후 실제 완성본 제목·카테고리·섹션 본문으로 교체
const MOCK_DOCUMENT_TITLE = "장학금 매칭 서비스 제안서";
const MOCK_CATEGORY_LABEL = "제안서";
const MOCK_SECTIONS: CompletedPreviewSection[] = [
  {
    orderNo: 1,
    title: "제안 배경",
    content:
      "최근 대학생의 장학금 수요가 늘고 있으나, 관련 정보는 학교 홈페이지·장학재단·학과 공지 등 여러 곳에 흩어져 있다.",
  },
  {
    orderNo: 2,
    title: "문제 및 필요성",
    content:
      "학생은 자신에게 맞는 장학금을 찾기 위해 여러 사이트를 오가며 반복적으로 탐색·비교해야 한다.",
  },
  {
    orderNo: 3,
    title: "목표 및 제안 범위",
    content:
      "학생은 자신에게 맞는 장학금을 찾기 위해 여러 사이트를 오가며 반복적으로 탐색·비교해야 한다.",
  },
  { orderNo: 4, title: "제안 내용", content: null },
  { orderNo: 5, title: "실행 방안", content: null },
  { orderNo: 6, title: "기대 효과", content: null },
];

export const CompletedDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingSection, setEditingSection] =
    useState<CompletedPreviewSection | null>(null);

  const handleCancelEdit = () => setEditingSection(null);

  const handleConfirmEdit = () => {
    if (!editingSection) return;
    navigate(`/workspace/${id}/sections/${editingSection.orderNo}`);
  };

  return (
    <CompletedLayout
      title="완성본"
      projectId={id ?? ""}
      progress={MOCK_PROGRESS}
      activeStepId={1}
    >
      <CompletedPreviewCard
        categoryLabel={MOCK_CATEGORY_LABEL}
        documentTitle={MOCK_DOCUMENT_TITLE}
        sections={MOCK_SECTIONS}
        onEditSection={(orderNo) =>
          setEditingSection(
            MOCK_SECTIONS.find((section) => section.orderNo === orderNo) ??
              null,
          )
        }
      />

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
