import { CREDIT_ICON_PATH } from "./creditIconPath";
import type { IconProps } from "./types";

export const CreditIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 22 22"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d={CREDIT_ICON_PATH}
      fill="url(#paint0_linear_2215_1818)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2215_1818"
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
