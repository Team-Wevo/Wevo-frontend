import checkSuccessIcon from "@/shared/assets/check-success.svg";
import { cn } from "@/shared/utils/cn";

interface SuccessToastProps {
  message: string;
  className?: string;
}

export const SuccessToast = ({ message, className }: SuccessToastProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex w-[182px] items-center gap-3 overflow-hidden rounded-md bg-gray-50 px-5 py-3 shadow-[0px_12px_32px_-4px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <div className="relative h-[9px] w-3 shrink-0">
        <div className="absolute inset-[-12.22%_-9.17%]">
          <img
            src={checkSuccessIcon}
            alt=""
            className="block size-full max-w-none"
          />
        </div>
      </div>
      <span className="shrink-0 text-xs leading-[15px] font-normal whitespace-nowrap text-gray-900">
        {message}
      </span>
    </div>
  );
};
