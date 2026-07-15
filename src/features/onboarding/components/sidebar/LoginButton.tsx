import { LogIn } from "lucide-react";

interface LoginButtonProps {
  onClick?: () => void;
}

const LoginButton = ({ onClick }: LoginButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl p-1.5 text-left text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
    >
      <div className="shadow-3xs flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
        <LogIn className="h-3.5 w-3.5 stroke-[2.5]" />
      </div>
      <span className="text-xs font-semibold tracking-tight">로그인하기</span>
    </button>
  );
};

export default LoginButton;
