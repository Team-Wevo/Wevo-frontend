import { useEffect, useRef, useState } from "react";

interface IdeaSectionProps {
  idea: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onEditToggle: () => void;
  onCompleteEdit: () => void;
}

const IdeaSection = ({
  idea,
  onChange,
  isEditing,
  onEditToggle,
  onCompleteEdit,
}: IdeaSectionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [idea, isEditing]);

  const showGuide = idea.length > 0 && idea.length < 10;
  const showMaxGuide = idea.length === 150;
  const normalizedIdea = idea.trim();

  return (
    <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
      <div className="text-xs leading-4 font-medium text-[#8b8d99]">
        입력한 아이디어
      </div>

      {isEditing ? (
        <div className="w-full rounded-lg border border-[#d4d4d8] bg-[#fbfaff] p-3 transition-all duration-200 focus-within:border-[#6b5aff] focus-within:ring-2 focus-within:ring-[#e0d7f5]">
          <textarea
            ref={textareaRef}
            value={idea}
            onChange={(event) => onChange(event.target.value.slice(0, 150))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onCompleteEdit();
              }
            }}
            maxLength={150}
            rows={1}
            placeholder="만들고 싶은 결과물을 적어주세요..."
            className="w-full resize-none overflow-hidden bg-transparent text-sm leading-7 text-[#3d3d3d] placeholder:text-[#8b8d99] focus:outline-none"
          />

          <div className="mt-2 flex items-end justify-between gap-3">
            <div className="min-h-[20px]">
              {showGuide && (
                <p className="text-xs leading-5 text-[#8b8d99]">
                  조금 더 구체적으로 적어주세요. (최소 10자)
                </p>
              )}

              {showMaxGuide && (
                <p className="text-xs leading-5 text-[#8b8d99]">
                  최대 150자까지 작성할 수 있어요.
                </p>
              )}
            </div>

            <span className="text-xs leading-4 text-[#8b8d99]">
              {idea.length} / 150
            </span>
          </div>

          <div
            className={`mt-3 h-0.5 rounded-full transition-all ${isFocused ? "bg-indigo-600" : "bg-gray-200"}`}
          />
        </div>
      ) : (
        <div className="flex w-full items-center gap-2 rounded-lg border border-[#d4d4d8] bg-[#f0f0f0] px-4 py-3">
          <div className="min-w-0 flex-1 text-sm leading-5 break-words text-[#3d3d3d]">
            {normalizedIdea.length > 0
              ? normalizedIdea
              : "입력한 아이디어가 없어요"}
          </div>

          <button
            type="button"
            onClick={onEditToggle}
            className="flex-shrink-0 cursor-pointer text-xs leading-4 font-medium whitespace-nowrap text-[#5a4dd1]"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
};

export default IdeaSection;
