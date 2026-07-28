import { ChevronDown } from "lucide-react";

const RecentProjectList = () => {
  return (
    <div className="mt-5 px-5">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold tracking-wider text-gray-400">
        <span>최근 프로젝트</span>
        <ChevronDown className="h-3 w-3 cursor-pointer text-gray-400" />
      </div>
      <ul className="space-y-1 text-xs font-medium text-gray-600">
        <li className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 hover:text-slate-900">
          <span className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-purple-400" />
          <span className="truncate text-slate-700">PM Day 발표 준비</span>
        </li>
        <li className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 hover:text-slate-900">
          <span className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-blue-400" />
          <span className="truncate text-slate-700">캡스톤 서비스 제안서</span>
        </li>
        <li className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 hover:text-slate-900">
          <span className="h-1.5 w-1.5 min-w-[6px] rounded-full bg-blue-400" />
          <span className="truncate text-slate-700">대외활동 기획안</span>
        </li>
      </ul>
    </div>
  );
};

export default RecentProjectList;
