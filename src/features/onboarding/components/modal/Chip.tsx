import {
  PRESSABLE_CHIP_STATE_CLASS,
  SELECTED_CHIP_STATE_CLASS,
} from "@/shared/styles/buttonStateStyles";
import { cn } from "@/shared/utils/cn";

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Chip = ({ label, selected, onClick }: ChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex h-8 cursor-pointer items-center justify-center rounded-full border px-3 text-[13px] leading-5 font-normal transition-colors",
        selected ? SELECTED_CHIP_STATE_CLASS : PRESSABLE_CHIP_STATE_CLASS,
      )}
    >
      {label}
    </button>
  );
};

export default Chip;
