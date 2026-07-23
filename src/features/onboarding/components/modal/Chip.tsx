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
          ? "border-main-600 bg-main-100 text-main-600"
          : "border-gray-400 bg-gray-50 text-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

export default Chip;
