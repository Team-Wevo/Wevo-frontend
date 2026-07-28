interface FooterButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const FooterButton = ({ disabled, onClick }: FooterButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center rounded-lg px-5 py-3 text-xs font-medium transition-colors ${
        disabled
          ? "cursor-not-allowed bg-[#ddd6f0] text-[#8b8d99]"
          : "cursor-pointer bg-[#6b5aff] text-[#fbfaff]"
      }`}
    >
      <span>작성 흐름 보기</span>
      <span className="ml-2">→</span>
    </button>
  );
};

export default FooterButton;
