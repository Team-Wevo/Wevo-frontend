import type { IconProps } from "./types";

export const PresentationOutlineIcon = ({
  size = 24,
  className = "",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.30556 0.75H13.1944M2.52778 4.35H14.9722M2.52778 7.95H14.9722C15.9541 7.95 16.75 8.75589 16.75 9.75V16.95C16.75 17.9441 15.9541 18.75 14.9722 18.75H2.52778C1.54594 18.75 0.75 17.9441 0.75 16.95V9.75C0.75 8.75589 1.54594 7.95 2.52778 7.95Z"
      stroke="url(#paint0_linear_2228_2055)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2228_2055"
        x1="8.75"
        y1="0.75"
        x2="8.75"
        y2="18.75"
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
