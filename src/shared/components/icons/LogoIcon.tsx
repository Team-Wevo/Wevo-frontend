import type { IconProps } from "./types";

export const LogoIcon = ({
  size = 48,
  color = "#735df4",
  className = "",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={color}
    className={className}
  >
    <circle
      cx="24"
      cy="24"
      r="22"
      fill={color}
    />
    <text
      x="24"
      y="28"
      textAnchor="middle"
      fill="white"
      fontSize="20"
      fontWeight="bold"
      fontFamily="Arial"
    >
      W
    </text>
  </svg>
);
