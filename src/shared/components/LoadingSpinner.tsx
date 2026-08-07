import { cn } from "../utils/cn";

interface LoadingSpinnerProps {
  /** 바깥 원의 지름(px) */
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 80,
  className = "",
}: LoadingSpinnerProps) => (
  <div
    className={cn("relative shrink-0", className)}
    style={{ width: size, height: size }}
    role="status"
    aria-label="불러오는 중"
  >
    <div
      className="text-main-600 h-full w-full animate-spin rounded-full"
      style={{
        background:
          "conic-gradient(from 90deg, rgb(241 245 249) 0deg, currentColor 360deg)",
      }}
    />
    <div
      className="absolute rounded-full bg-gray-50"
      style={{ inset: size * 0.125 }}
    />
  </div>
);

export default LoadingSpinner;
