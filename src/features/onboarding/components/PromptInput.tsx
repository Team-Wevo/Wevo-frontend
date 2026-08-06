import { useEffect, useRef, useState } from "react";
import { ArrowUpIcon } from "@/shared/components/icons";
import { PRESSABLE_SEND_BUTTON_STATE_CLASS } from "@/shared/styles/buttonStateStyles";
import { cn } from "@/shared/utils/cn";

const MAX_LENGTH = 150;
const MIN_LENGTH = 10;

interface PromptInputProps {
  onSubmit: (value: string) => void;
}

const PromptInput = ({ onSubmit }: PromptInputProps) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [text]);

  const isMaxLengthReached = text.length === MAX_LENGTH;
  const showGuide = text.length > 0 && text.length < MIN_LENGTH;
  const showMaxGuide = isMaxLengthReached;
  // 1~9자는 전송 금지. 0자도 마찬가지로 비활성 상태를 유지한다.
  const canSubmit = text.length >= MIN_LENGTH && text.length <= MAX_LENGTH;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit(text.trim());
  };

  return (
    <div className="w-full rounded-md border border-slate-300 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) {
              return;
            }

            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          maxLength={MAX_LENGTH}
          rows={1}
          placeholder="예) 장학금 매칭 서비스를 공모전 제안서로 만들고 싶어요"
          className="w-full resize-none overflow-hidden bg-transparent text-sm leading-7 text-slate-800 placeholder:text-slate-500 focus:outline-none"
        />

        <div className="flex items-end justify-between gap-3">
          <div className="min-h-5">
            {showGuide && (
              <p className="text-xs leading-5 text-slate-400">
                조금 더 구체적으로 적어주세요. (최소 {MIN_LENGTH}자)
              </p>
            )}

            {showMaxGuide && (
              <p className="text-error text-xs leading-5">
                최대 {MAX_LENGTH}자까지 작성할 수 있어요.
              </p>
            )}
          </div>

          <div className="flex items-end gap-3">
            <span
              className={`text-xs leading-4 ${
                isMaxLengthReached ? "text-error" : "text-slate-400"
              }`}
            >
              {text.length} / {MAX_LENGTH}
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              aria-label="보내기"
              className={cn(
                "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-sm",
                PRESSABLE_SEND_BUTTON_STATE_CLASS,
              )}
            >
              <ArrowUpIcon size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
