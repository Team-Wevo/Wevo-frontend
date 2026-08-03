import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ProjectIcon,
  CompleteFileIcon,
} from "@/shared/components/icons";

const NavigationMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="space-y-1 px-3 py-5">
      <button
        type="button"
        onClick={() => navigate("/home")}
        className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 transition-colors ${
          isActive("/home") ? "bg-main-50" : "hover:bg-gray-100"
        }`}
      >
        <HomeIcon size={24} />
        <span
          className={`font-semibold ${
            isActive("/home")
              ? "text-lg text-slate-900"
              : "text-base text-gray-600"
          }`}
        >
          홈
        </span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/list/project")}
        className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 transition-colors ${
          isActive("/list/project") ? "bg-main-50" : "hover:bg-gray-100"
        }`}
      >
        <ProjectIcon size={24} />
        <span
          className={`font-semibold ${
            isActive("/list/project")
              ? "text-lg text-slate-900"
              : "text-base text-gray-600"
          }`}
        >
          프로젝트
        </span>
      </button>

      <button
        type="button"
        onClick={() => navigate("/list/completed")}
        className={`flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 transition-colors ${
          isActive("/list/completed") ? "bg-main-50" : "hover:bg-gray-100"
        }`}
      >
        <CompleteFileIcon size={24} />
        <span
          className={`font-semibold ${
            isActive("/list/completed")
              ? "text-lg text-slate-900"
              : "text-base text-gray-600"
          }`}
        >
          완성본
        </span>
      </button>
    </nav>
  );
};

export default NavigationMenu;
