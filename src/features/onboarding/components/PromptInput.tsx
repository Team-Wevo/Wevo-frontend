import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PromptInputProps {
  onSubmit: (value: string) => void;
}

const PromptInput = ({ onSubmit }: PromptInputProps) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text]);

  const isMaxLengthReached = text.length === 150;
  const showGuide = text.length > 0 && text.length < 10;
  const showMaxGuide = isMaxLengthReached;
  const canSubmit = text.length >= 10 && text.length <= 150;
  const shouldHighlightButton = isFocused && canSubmit;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit(text.trim());
  };

  return (
    <div className="w-full rounded-md border border-slate-300 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 150))}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) {
              return;
            }

            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          maxLength={150}
          rows={1}
          placeholder="예) 장학금 매칭 서비스를 공모전 제안서로 만들고 싶어요"
          className="w-full resize-none overflow-hidden bg-transparent text-sm leading-7 text-slate-800 placeholder:text-slate-500 focus:outline-none"
        />

        <div className="flex items-end justify-between gap-3">
          <div className="min-h-[20px]">
            {showGuide && (
              <p className="text-xs leading-5 text-slate-400">
                조금 더 구체적으로 적어주세요. (최소 10자)
              </p>
            )}

            {showMaxGuide && (
              <p className="text-error text-xs leading-5">
                최대 150자까지 작성할 수 있어요.
              </p>
            )}
          </div>

          <div className="flex items-end gap-3">
            <span
              className={`text-xs leading-4 ${
                isMaxLengthReached ? "text-error" : "text-slate-400"
              }`}
            >
              {text.length} / 150
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex h-9 w-9 min-w-[36px] items-center justify-center rounded-sm transition-all duration-200 ${
                shouldHighlightButton
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
              } ${canSubmit ? "hover:bg-indigo-600 hover:text-white" : ""}`}
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
