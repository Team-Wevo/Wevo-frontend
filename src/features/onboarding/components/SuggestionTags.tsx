import { File, Mic, Pencil } from "lucide-react";

interface SuggestionTagsProps {
  onSelectDocumentType: (
    documentType: "proposal" | "presentation" | "free",
  ) => void;
}

const SuggestionTags = ({ onSelectDocumentType }: SuggestionTagsProps) => {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        type="button"
        onClick={() => onSelectDocumentType("proposal")}
        className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600"
      >
        <File className="h-3.5 w-3.5 text-blue-500" />
        <span>제안서</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectDocumentType("presentation")}
        className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600"
      >
        <Mic className="h-3.5 w-3.5 text-purple-500" />
        <span>발표 구성안</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectDocumentType("free")}
        className="shadow-3xs flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-indigo-400 hover:text-indigo-600"
      >
        <Pencil className="h-3.5 w-3.5 text-indigo-500" />
        <span>자유주제</span>
      </button>
    </div>
  );
};
export default SuggestionTags;
