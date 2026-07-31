import type { ReactNode } from "react";
import { cn } from "../../../../shared/utils/cn";

interface SectionBlockProps {
  children: ReactNode;
  className?: string;
}

const SectionBlock = ({ children, className }: SectionBlockProps) => {
  return (
    <section
      className={cn(
        "rounded-[12px] border border-gray-400 bg-gray-50 p-5",
        className,
      )}
    >
      {children}
    </section>
  );
};

export default SectionBlock;
