import type { IconProps } from "./types";

/**
 * 입력창 전송 버튼용 위쪽 화살표.
 * 버튼 상태에 따라 색이 바뀌므로 stroke를 currentColor로 두고 상위 text 색상을 따른다.
 */
export const ArrowUpIcon = ({ size = 13, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 13"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 12V1M11 6L6 1L1 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
