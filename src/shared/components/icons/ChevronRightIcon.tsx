import type { IconProps } from "./types";

export const ChevronRightIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 9 16"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 15L8 8L1 1"
      stroke="url(#paint0_linear_2208_1754)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2208_1754"
        x1="4.5"
        y1="1"
        x2="4.5"
        y2="15"
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
