import type { IconProps } from "./types";

export const CreditLoadingIcon = ({
  size = 24,
  color = "currentColor",
  className = "",
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    className={className}
  >
    <line
      x1="12"
      y1="2"
      x2="12"
      y2="6"
    />
    <line
      x1="12"
      y1="18"
      x2="12"
      y2="22"
    />
    <line
      x1="4.22"
      y1="4.22"
      x2="7.07"
      y2="7.07"
    />
    <line
      x1="16.93"
      y1="16.93"
      x2="19.78"
      y2="19.78"
    />
    <line
      x1="2"
      y1="12"
      x2="6"
      y2="12"
    />
    <line
      x1="18"
      y1="12"
      x2="22"
      y2="12"
    />
    <line
      x1="4.22"
      y1="19.78"
      x2="7.07"
      y2="16.93"
    />
    <line
      x1="16.93"
      y1="7.07"
      x2="19.78"
      y2="4.22"
    />
  </svg>
);
