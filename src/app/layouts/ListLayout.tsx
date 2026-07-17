import type { ReactNode } from "react";

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
    <div className="px-10 py-8">
      {/* 헤더: 타이틀 + 페이지별 액션 버튼 슬롯 */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
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
            className={
              index === activeFilterIndex
                ? "rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm"
                : "rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
            }
          >
            {filter.label} {filter.count}
          </button>
        ))}
      </div>

      {/* 카드 그리드 컨테이너 (카드 내용은 각 페이지에서 채움) */}
      <div className="grid grid-cols-4 gap-5">{children}</div>
    </div>
  );
};

export default ListLayout;
