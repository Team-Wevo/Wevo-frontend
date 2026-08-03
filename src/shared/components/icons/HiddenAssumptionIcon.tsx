import type { IconProps } from "./types";

export const HiddenAssumptionIcon = ({
  size = 24,
  className = "",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.73645 3.2108C9.59986 2.98872 11.4847 3.38265 13.1033 4.33244C14.7218 5.28222 15.985 6.73566 16.7 8.4708C16.7667 8.65041 16.7667 8.84799 16.7 9.0276C16.406 9.7404 16.0175 10.4104 15.5449 11.0196M10.4171 10.4764C9.96449 10.9136 9.35828 11.1555 8.72904 11.15C8.0998 11.1445 7.49788 10.8921 7.05292 10.4472C6.60796 10.0022 6.35557 9.40023 6.3501 8.77096C6.34464 8.14169 6.58653 7.53545 7.02369 7.0828M13.133 13.1492C12.0718 13.7778 10.8879 14.1708 9.66144 14.3015C8.43502 14.4322 7.19484 14.2976 6.02504 13.9067C4.85524 13.5158 3.78321 12.8779 2.88167 12.0362C1.98013 11.1945 1.27018 10.1687 0.800002 9.0284C0.733333 8.84879 0.733333 8.65121 0.800002 8.4716C1.50927 6.75148 2.75724 5.3078 4.35662 4.3572M0.750404 0.75L16.7496 16.75"
      stroke="url(#paint0_linear_2215_1939)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2215_1939"
        x1="8.75"
        y1="0.75"
        x2="8.75"
        y2="16.75"
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
