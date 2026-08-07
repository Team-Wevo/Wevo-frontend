import { CREDIT_ICON_PATH } from "./creditIconPath";
import type { IconProps } from "./types";

/**
 * AI 처리 중임을 알리는 크레딧 아이콘 (Figma: 크레딧 로딩)
 * 회색 글리프 위에 보라 글리프를 겹치고 위쪽 투명도를 반복 전환해,
 * 색이 보라 ↔ 회색으로 깜빡이는 것처럼 보이게 한다.
 */
export const CreditLoadingIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    className={className}
    role="img"
    aria-label="AI 처리 중"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={CREDIT_ICON_PATH}
      fill="url(#paint_credit_loading_idle)"
    />
    <path
      d={CREDIT_ICON_PATH}
      fill="url(#paint_credit_loading_active)"
      className="animate-credit-blink"
    />
    <defs>
      <linearGradient
        id="paint_credit_loading_idle"
        x1="10.5"
        y1="0"
        x2="10.5"
        y2="21.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EEF2F6" />
        <stop
          offset="1"
          stopColor="#394255"
        />
      </linearGradient>
      <linearGradient
        id="paint_credit_loading_active"
        x1="10.5"
        y1="0"
        x2="10.5"
        y2="21.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B8AEFF" />
        <stop
          offset="1"
          stopColor="#322A85"
        />
      </linearGradient>
    </defs>
  </svg>
);
