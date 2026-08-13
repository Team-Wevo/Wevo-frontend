import type { ButtonHTMLAttributes } from "react";
import {
  PRESSABLE_AI_BUTTON_STATE_CLASS,
  PRESSABLE_BUTTON_STATE_CLASS,
  PRESSABLE_EDIT_BUTTON_STATE_CLASS,
  PRESSABLE_RECT_BUTTON_STATE_CLASS,
} from "../styles/buttonStateStyles";
import { cn } from "../utils/cn";

export type ButtonType =
  | "main"
  | "outline"
  | "red"
  | "green"
  | "transparent"
  | "pressable"
  | "pressableStrong"
  | "pressableDanger"
  | "draftEdit"
  | "ai";

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  type?: ButtonType;
}

const BASE_CLASS =
  "flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-sm border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50";

const TYPE_STYLE_CLASS: Record<ButtonType, string> = {
  main: "border-transparent bg-main-600 text-gray-50 hover:bg-main-700",
  outline: "border-gray-400 bg-gray-50 text-gray-700 hover:bg-gray-200",
  red: "border-transparent bg-error text-gray-50 hover:bg-error/90",
  green: "border-transparent bg-success text-gray-50 hover:bg-success/90",
  transparent:
    "border-transparent bg-transparent text-gray-700 hover:bg-gray-200",
  pressable: cn(
    PRESSABLE_BUTTON_STATE_CLASS,
    PRESSABLE_RECT_BUTTON_STATE_CLASS,
  ),
  pressableStrong: cn(
    PRESSABLE_BUTTON_STATE_CLASS,
    PRESSABLE_RECT_BUTTON_STATE_CLASS,
    "active:bg-main-600",
  ),
  pressableDanger: cn(
    PRESSABLE_BUTTON_STATE_CLASS,
    PRESSABLE_RECT_BUTTON_STATE_CLASS,
    "text-error hover:text-error active:text-white disabled:hover:text-error",
  ),
  draftEdit: PRESSABLE_EDIT_BUTTON_STATE_CLASS,
  ai: PRESSABLE_AI_BUTTON_STATE_CLASS,
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
