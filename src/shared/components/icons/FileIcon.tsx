import type { IconProps } from "./types";

export const FileIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 17 16"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.25 13.25V10.4069C7.25 9.34599 7.64525 8.24055 8.63868 7.86835C9.29149 7.62377 10.0723 7.53593 10.8816 7.83726C11.8758 8.20745 12.25 9.34599 12.25 10.4069V13.25C12.25 13.9167 11.75 15.25 9.75 15.25C7.75 15.25 8.58333 15.25 9.25 15.25H3.25C2.58333 15.2499 0.75 14.75 0.75 12.7498V3.75C0.75 2.75 1.25 0.75 3.25 0.75H7.25C8.1882 0.75 9.12641 1.19011 9.6517 2.48326C9.72293 2.65862 9.78668 2.83822 9.88484 3.00006C10.0899 3.33819 10.464 3.75 11.25 3.75H13.75C14.75 3.75 16.25 4.75 16.25 6.25V12.7498C16.25 13.5646 16.0509 14.4456 15.3284 14.9605C14.9783 15.21 14.5308 15.25 14.1009 15.25H13.75"
      stroke="url(#paint0_linear_2208_1725)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2208_1725"
        x1="8.5"
        y1="0.75"
        x2="8.5"
        y2="15.25"
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
