import type { ReactNode } from "react";
import { cn } from "../../shared/utils/cn";

interface ListFilter {
  label: string;
  count: number;
}

interface ListLayoutProps {
  title: string;
  actions?: ReactNode;
  filters: ListFilter[];
  activeFilterIndex: number;
  onFilterChange: (index: number) => void;
  children: ReactNode;
}

const ListLayout = ({
  title,
  actions,
  filters,
  activeFilterIndex,
  onFilterChange,
  children,
}: ListLayoutProps) => {
  return (
    <div className="my-12 p-16">
      {/* 헤더: 타이틀 + 페이지별 액션 버튼 슬롯 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="color-[#1A1D2E] text-3xl font-semibold text-gray-900">
          {title}
        </h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* 필터 탭 */}
      <div className="mb-6 flex items-center gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter.label}
            onClick={() => onFilterChange(index)}
            className={cn(
              "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-normal transition-colors",
              index === activeFilterIndex
                ? "bg-main-600"
                : "bg-gray-50 outline outline-gray-400",
            )}
          >
            <span
              className={
                index === activeFilterIndex ? "text-gray-50" : "text-gray-700"
              }
            >
              {filter.label}
            </span>
            <span
              className={
                index === activeFilterIndex ? "text-gray-50" : "text-gray-600"
              }
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* 카드 그리드 컨테이너 (카드 내용은 각 페이지에서 채움) */}
      <div className="grid grid-cols-4 gap-5">{children}</div>
    </div>
  );
};

export default ListLayout;
