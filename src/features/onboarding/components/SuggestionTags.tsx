import type { ComponentType } from "react";
import {
  PresentationOutlineIcon,
  ProposalIcon,
} from "@/shared/components/icons";
import SuggestionTagButton from "./SuggestionTagButton";

type DocumentType = "proposal" | "presentation";

interface Suggestion {
  documentType: DocumentType;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconType?: "fill" | "stroke";
  label: string;
}

const suggestions: Suggestion[] = [
  {
    documentType: "proposal",
    icon: ProposalIcon,
    iconType: "fill",
    label: "제안서",
  },
  {
    documentType: "presentation",
    icon: PresentationOutlineIcon,
    label: "발표 구성안",
  },
];

interface SuggestionTagsProps {
  onSelectDocumentType: (documentType: DocumentType) => void;
}

const SuggestionTags = ({ onSelectDocumentType }: SuggestionTagsProps) => {
  return (
    <div className="mt-4 flex justify-center gap-3">
      {suggestions.map(({ documentType, icon, iconType, label }) => (
        <SuggestionTagButton
          key={documentType}
          icon={icon}
          iconType={iconType}
          label={label}
          onClick={() => onSelectDocumentType(documentType)}
        />
      ))}
    </div>
  );
};
export default SuggestionTags;
