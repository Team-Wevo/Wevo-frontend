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
      <div className="text-xs leading-4 font-medium text-gray-700">
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
          placeholder="예) 스타트업 대표, 동아리 부원"
          className="focus:border-main-600 w-full rounded-md border border-gray-400 bg-gray-50 px-4 py-3 text-xs text-gray-800 transition-all duration-200 placeholder:text-gray-700 focus:outline-none"
        />
      )}
    </div>
  );
};

export default AudienceSection;
