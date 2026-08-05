import Chip from "./Chip";

interface DocumentTypeSectionProps {
  value: "proposal" | "presentation" | null;
  onChange: (value: "proposal" | "presentation" | null) => void;
}

const documentOptions = [
  { value: "proposal", label: "제안서" },
  { value: "presentation", label: "발표 구성안" },
] as const;

const DocumentTypeSection = ({ value, onChange }: DocumentTypeSectionProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
      <div className="text-xs leading-4 font-medium text-gray-700">
        무엇으로 만들까요?
      </div>

      <div className="flex flex-wrap items-start justify-start gap-2 overflow-hidden">
        {documentOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentTypeSection;
