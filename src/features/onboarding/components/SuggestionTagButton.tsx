import type { ComponentType } from "react";
import {
  PRESSABLE_BUTTON_STATE_CLASS,
  PRESSABLE_FILL_ICON_STATE_CLASS,
  PRESSABLE_STROKE_ICON_STATE_CLASS,
} from "@/shared/styles/buttonStateStyles";
import { cn } from "@/shared/utils/cn";

interface SuggestionIconProps {
  size?: number;
  className?: string;
}

interface SuggestionTagButtonProps {
  icon: ComponentType<SuggestionIconProps>;
  iconType?: "fill" | "stroke";
  label: string;
  onClick: () => void;
}

const SuggestionTagButton = ({
  icon: Icon,
  iconType = "stroke",
  label,
  onClick,
}: SuggestionTagButtonProps) => {
  const iconStateClass =
    iconType === "fill"
      ? PRESSABLE_FILL_ICON_STATE_CLASS
      : PRESSABLE_STROKE_ICON_STATE_CLASS;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 cursor-pointer items-center gap-2 overflow-hidden rounded-full border px-3 text-[13px] leading-[18px] font-medium",
        PRESSABLE_BUTTON_STATE_CLASS,
      )}
    >
      <span className="flex size-5 shrink-0 items-center justify-center">
        <Icon
          size={15}
          className={iconStateClass}
        />
      </span>
      <span className="translate-y-px whitespace-nowrap">{label}</span>
    </button>
  );
};

export default SuggestionTagButton;
