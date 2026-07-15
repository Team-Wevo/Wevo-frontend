import { FileText, Home, LayoutGrid } from "lucide-react";

const NavigationMenu = () => {
  return (
    <nav className="space-y-0.5 px-3 py-2">
      <div className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-xl bg-gray-100 px-3 transition-colors">
        <Home className="h-4 w-4 text-indigo-600" />
        <span className="text-sm font-semibold text-indigo-600">홈</span>
      </div>

      <div className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-gray-400 transition-colors hover:bg-gray-100 hover:text-slate-700">
        <LayoutGrid className="h-4 w-4 text-gray-300" />
        <span className="text-sm font-medium text-gray-500">프로젝트</span>
      </div>

      <div className="flex h-9 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-gray-400 transition-colors hover:bg-gray-100 hover:text-slate-700">
        <FileText className="h-4 w-4 text-gray-300" />
        <span className="text-sm font-medium text-gray-500">완성본</span>
      </div>
    </nav>
  );
};

export default NavigationMenu;
