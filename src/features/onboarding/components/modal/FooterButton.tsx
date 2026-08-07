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
      className={`flex h-[50px] w-full items-center justify-center gap-2 rounded-[8px] px-5 py-3 transition-colors [&>span:first-child]:text-base [&>span:first-child]:leading-[26px] [&>span:first-child]:font-normal [&>span:last-child]:ml-0 [&>span:last-child]:text-[13px] [&>span:last-child]:leading-[18px] [&>span:last-child]:font-medium ${
        disabled
          ? "bg-main-100 cursor-not-allowed text-gray-700"
          : "bg-main-600 cursor-pointer text-gray-50"
      }`}
    >
      <span>작성 흐름 보기</span>
      <span className="ml-2">→</span>
    </button>
  );
};

export default FooterButton;
