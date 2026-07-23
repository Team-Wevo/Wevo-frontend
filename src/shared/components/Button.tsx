import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export type ButtonType = "main" | "outline" | "red" | "green" | "transparent";

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  type?: ButtonType;
}

const BASE_CLASS =
  "flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50";

const TYPE_STYLE_CLASS: Record<ButtonType, string> = {
  main: "border-transparent bg-main-600 text-gray-50 hover:bg-main-700",
  outline: "border-gray-400 bg-gray-50 text-gray-700 hover:bg-gray-200",
  red: "border-transparent bg-error text-gray-50 hover:bg-error/90",
  green: "border-transparent bg-success text-gray-50 hover:bg-success/90",
  transparent:
    "border-transparent bg-transparent text-gray-700 hover:bg-gray-200",
};

export const Button = ({
  type = "outline",
  className,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={cn(BASE_CLASS, TYPE_STYLE_CLASS[type], className)}
    {...props}
  />
);
