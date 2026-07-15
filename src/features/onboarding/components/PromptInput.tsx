import { ArrowUp } from "lucide-react";

const PromptInput = () => {
  return (
    <div className="flex w-full max-w-[576px] items-center justify-between rounded-[16px] border border-gray-200 bg-white p-3 shadow-xs transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 hover:shadow-md">
      <input
        type="text"
        placeholder="예) 일치하는 서비스를 제공하도록 제안합니다."
        className="w-full bg-transparent px-1 text-sm text-slate-800 placeholder-slate-600 outline-none focus:text-slate-900 focus:placeholder-slate-400"
      />
      <button className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-xl bg-gray-100 text-gray-400 transition-all duration-200 hover:bg-indigo-600 hover:text-white">
        <ArrowUp className="h-4 w-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

export default PromptInput;
