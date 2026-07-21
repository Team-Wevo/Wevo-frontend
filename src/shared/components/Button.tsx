import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type ButtonBase = "main" | "default" | "white" | "error";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  base?: ButtonBase;
  textColor?: string;
}

const BASE_CLASS =
  "flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50";

const BASE_STYLE_CLASS: Record<ButtonBase, string> = {
  main: "border-transparent bg-main-600 hover:bg-main-700",
  default: "border-gray-400 bg-gray-50 hover:bg-gray-200",
  white: "border-transparent bg-transparent hover:bg-gray-200",
  error: "border-transparent bg-error hover:bg-error/90",
};

const DEFAULT_TEXT_COLOR: Record<ButtonBase, string> = {
  main: "gray-50",
  default: "gray-700",
  white: "gray-700",
  error: "gray-50",
};

export const Button = ({
  base = "default",
  textColor,
  className,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      BASE_CLASS,
      BASE_STYLE_CLASS[base],
      `text-${textColor ?? DEFAULT_TEXT_COLOR[base]}`,
      className,
    )}
    {...props}
  />
);
