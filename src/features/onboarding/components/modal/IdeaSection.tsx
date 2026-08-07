import { useCallback, useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [isEditing]);

  const normalizedIdea = idea.trim();
  const isValidIdea = normalizedIdea.length >= 10;

  const tryCompleteEdit = useCallback(() => {
    if (!isValidIdea) {
      return;
    }

    onCompleteEdit();
  }, [isValidIdea, onCompleteEdit]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (textareaRef.current?.contains(target)) {
        return;
      }

      tryCompleteEdit();
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown, true);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleDocumentPointerDown,
        true,
      );
    };
  }, [isEditing, tryCompleteEdit]);

  // 조건 판단 로직 변수화 (가독성 향상)
  const isUnderMinLength = normalizedIdea.length < 10;
  const isMaxLengthReached = idea.length === 150;
  const isGuideVisible = isUnderMinLength;
  const isCharCountVisible =
    isUnderMinLength || isFocused || isMaxLengthReached;

  return (
    <div className="flex w-full flex-col items-start overflow-hidden">
      <div className="text-xs leading-4 font-medium text-gray-700">
        입력한 아이디어
      </div>

      {isEditing ? (
        <div className="mt-2 flex w-full flex-col gap-2">
          {/* 입력창 */}
          <div className="focus-within:border-main-600 flex min-h-[46px] w-full items-center rounded-[8px] border border-gray-400 bg-gray-50 px-4 py-3 transition-colors duration-200">
            <textarea
              ref={textareaRef}
              value={idea}
              onChange={(event) => onChange(event.target.value.slice(0, 150))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) {
                  return;
                }

                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  tryCompleteEdit();
                }
              }}
              maxLength={150}
              rows={1}
              placeholder="만들고 싶은 결과물을 적어주세요..."
              className="w-full resize-none overflow-hidden bg-transparent text-sm leading-[22px] text-gray-800 placeholder:text-gray-700 focus:outline-none"
            />
          </div>

          {/* 입력창 아래 (하단 가이드 및 글자 수) */}
          <div className="flex items-end justify-between gap-3">
            <div className="min-h-[20px]">
              {isGuideVisible && (
                <p className="text-[13px] leading-5 text-gray-700">
                  조금 더 구체적으로 적어주세요. (최소 10자)
                </p>
              )}

              {isMaxLengthReached && (
                <p className="text-error text-[13px] leading-5">
                  최대 150자까지 작성할 수 있어요.
                </p>
              )}
            </div>

            {isCharCountVisible && (
              <span
                className={`text-[13px] leading-5 ${
                  isMaxLengthReached ? "text-error" : "text-gray-700"
                }`}
              >
                {idea.length} / 150
              </span>
            )}
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onEditToggle}
            className="mt-2 flex h-[46px] w-full cursor-pointer items-center gap-2 overflow-hidden rounded-[8px] bg-gray-100 px-4 py-3 text-left"
          >
            <span className="min-w-0 flex-1 truncate text-sm leading-[22px] text-gray-800">
              {normalizedIdea.length > 0
                ? normalizedIdea
                : "내용을 입력하세요."}
            </span>
            <span className="text-main-700 flex-shrink-0 text-xs leading-4 font-medium whitespace-nowrap">
              수정
            </span>
          </button>

          {isUnderMinLength && (
            <p className="mt-1 text-xs leading-[15px] text-[#dc3e26]">
              아이디어를 입력해주세요
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default IdeaSection;
