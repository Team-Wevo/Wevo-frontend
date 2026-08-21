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
  /** 비로그인처럼 집계가 의미 없는 상황에서는 개수를 숨긴다. */
  showFilterCounts?: boolean;
  children: ReactNode;
}

const ListLayout = ({
  title,
  actions,
  filters,
  activeFilterIndex,
  onFilterChange,
  showFilterCounts = true,
  children,
}: ListLayoutProps) => {
  return (
    <div className="my-6 p-4 md:my-12 md:p-16">
      {/* 헤더: 타이틀 + 페이지별 액션 버튼 슬롯 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          {title}
        </h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* 필터 탭 */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter.label}
            onClick={() => onFilterChange(index)}
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-sm font-normal transition-colors",
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
            {showFilterCounts && (
              <span
                className={
                  index === activeFilterIndex ? "text-gray-50" : "text-gray-600"
                }
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 카드 그리드 컨테이너 (카드 내용은 각 페이지에서 채움) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
      </div>
    </div>
  );
};

export default ListLayout;
