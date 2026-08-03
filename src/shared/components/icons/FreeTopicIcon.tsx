import type { IconProps } from "./types";

export const FreeTopicIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 13 20"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 11.55C9.18333 10.65 9.64167 10.02 10.375 9.3C11.2917 8.49 11.75 7.32 11.75 6.15C11.75 4.71783 11.1705 3.34432 10.1391 2.33162C9.10764 1.31893 7.70869 0.75 6.25 0.75C4.79131 0.75 3.39236 1.31893 2.36091 2.33162C1.32946 3.34432 0.75 4.71783 0.75 6.15C0.75 7.05 0.933333 8.13 2.125 9.3C2.76667 9.93 3.31667 10.65 3.5 11.55M3.5 15.15H9M4.41667 18.75H8.08333"
      stroke="url(#paint0_linear_2228_2057)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2228_2057"
        x1="6.25"
        y1="0.75"
        x2="6.25"
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
