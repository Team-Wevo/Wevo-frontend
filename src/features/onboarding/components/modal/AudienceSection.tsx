import Chip from "./Chip";

interface AudienceSectionProps {
  value: "judge" | "professor" | "member" | "custom" | null;
  customAudience: string;
  onChange: (value: "judge" | "professor" | "member" | "custom" | null) => void;
  onCustomAudienceChange: (value: string) => void;
}

const audienceOptions = [
  { value: "judge", label: "심사위원" },
  { value: "professor", label: "교수" },
  { value: "member", label: "팀원" },
  { value: "custom", label: "직접 입력" },
] as const;

const AudienceSection = ({
  value,
  customAudience,
  onChange,
  onCustomAudienceChange,
}: AudienceSectionProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
      <div className="text-xs leading-4 font-medium text-[#8b8d99]">
        누가 읽나요?
      </div>

      <div className="flex flex-wrap items-start justify-start gap-2 overflow-hidden">
        {audienceOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>

      {value === "custom" && (
        <input
          type="text"
          value={customAudience}
          onChange={(event) => onCustomAudienceChange(event.target.value)}
          placeholder="예) 스타트업 대표"
          className="w-full rounded-lg border border-[#d4d4d8] bg-[#fbfaff] px-4 py-3 text-sm text-[#3d3d3d] transition-all duration-200 placeholder:text-[#8b8d99] focus:border-[#6b5aff] focus:ring-2 focus:ring-[#e0d7f5] focus:outline-none"
        />
      )}
    </div>
  );
};

export default AudienceSection;
