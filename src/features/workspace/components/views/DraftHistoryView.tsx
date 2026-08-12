import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner";
import { getSectionDraftErrorMessage } from "../../api/getSectionDraft";
import { useSectionDraft } from "../../hooks/useSectionDraft";
import SectionBlock from "../blocks/SectionBlock";

interface DraftHistoryViewProps {
  sectionId: number;
}

const DraftHistoryView = ({ sectionId }: DraftHistoryViewProps) => {
  const draftQuery = useSectionDraft(sectionId);

  return (
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
        <div className="text-base leading-6 font-normal whitespace-pre-wrap text-gray-900">
          {draftQuery.data.content}
        </div>
      )}
    </SectionBlock>
  );
};

export default DraftHistoryView;
