import type { IconProps } from "./types";

export const HomeIcon = ({ size = 24, className = "" }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 17"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.25 14.1928V10.9747C6.25 10.141 6.47596 9.28096 7.14025 8.77722C7.99128 8.13188 9.17991 7.7735 10.3857 8.74892C11.0338 9.27326 11.25 10.141 11.25 10.9747V13.2954C11.25 13.8863 11.142 14.4878 10.7842 14.9581C10.2455 15.6661 9.49775 16.1927 8.75 16.1927C7.75 16.1927 7.01795 16.1928 5.75 16.1927H3.25C2.25 16.1927 0.75 14.6929 0.75 13.1927V7.6927C0.75 6.69287 1.25 6.19287 1.75 5.6927L7.25 1.1927C7.75 0.859365 9.05 0.392698 10.25 1.1927L15.75 5.6927C16.25 6.19287 16.75 6.69287 16.75 7.6927V13.1927C16.75 14.1928 15.75 16.1927 14.25 16.1927L12.25 16.1929"
      stroke="url(#paint0_linear_2208_1729)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2208_1729"
        x1="8.75"
        y1="0.750977"
        x2="8.75"
        y2="16.1929"
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
