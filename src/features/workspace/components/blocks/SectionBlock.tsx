import type { ReactNode } from "react";

interface SectionBlockProps {
  children: ReactNode;
}

const SectionBlock = ({ children }: SectionBlockProps) => {
  return (
    <section className="flex flex-col gap-2 rounded-[12px] border border-gray-400 bg-gray-50 p-5">
      {children}
    </section>
  );
};

export default SectionBlock;
