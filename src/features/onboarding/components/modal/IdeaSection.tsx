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

  const normalizedIdea = idea.trim();

  // 조건 판단 로직 변수화 (가독성 향상)
  const isUnderMinLength = idea.length < 10;
  const isGuideVisible = isUnderMinLength;
  const isCharCountVisible = isUnderMinLength || isFocused;

  return (
    <div className="flex w-full flex-col items-start gap-1 overflow-hidden">
      <div className="text-xs leading-4 font-medium text-gray-700">
        입력한 아이디어
      </div>

      {isEditing ? (
        <div className="flex w-full flex-col gap-1">
          {/* 입력창 */}
          <div className="focus-within:border-main-600 w-full rounded-md border border-[#d4d4d8] bg-[#fbfaff] p-3 transition-all duration-200">
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
          </div>

          {/* 입력창 아래 (하단 가이드 및 글자 수) */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-h-[20px]">
              {isGuideVisible && (
                <p className="text-xs leading-5 text-red-500">
                  조금 더 구체적으로 적어주세요. (최소 10자)
                </p>
              )}
            </div>

            {isCharCountVisible && (
              <span className="text-xs leading-4 text-[#8b8d99]">
                {idea.length} / 150
              </span>
            )}
          </div>
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
            className="text-main-700 flex-shrink-0 cursor-pointer text-xs leading-4 font-medium whitespace-nowrap"
          >
            수정
          </button>
        </div>
      )}
    </div>
  );
};

export default IdeaSection;
