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
      className={`flex h-8 cursor-pointer items-center justify-center rounded-full border px-3 text-xs leading-5 font-normal transition-colors ${
        selected
          ? "border-main-600 text-main-600 bg-[#e0d7f5]"
          : "border-[#d4d4d8] bg-[#fbfaff] text-[#8b8d99]"
      }`}
    >
      {label}
    </button>
  );
};

export default Chip;
