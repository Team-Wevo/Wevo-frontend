import { CreditIcon } from "../../../../shared/components/icons";
import { cn } from "../../../../shared/utils/cn";
import { ACTIVITY_TONE_CLASS } from "./constants";
import type { DraftViewState } from "./types";

interface DraftStatusHeaderProps {
  state: DraftViewState;
}

const DraftStatusHeader = ({ state }: DraftStatusHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-base leading-6 font-normal text-gray-900">
          초안
        </span>
        <span className="bg-main-50 text-main-700 flex items-center gap-1 rounded-full px-2 py-1 text-xs leading-4 font-normal">
          <CreditIcon size={14} />
          {state.sourceLabel}
        </span>
        <button
          type="button"
          className="text-main-700 text-xs leading-5 font-normal"
          aria-label="근거 보기"
        >
          근거 보기
        </button>
      </div>

      {state.activity && (
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-xs leading-4",
              ACTIVITY_TONE_CLASS[state.activity.tone],
            )}
            aria-hidden
          >
            ●
          </span>
          <span className="text-xs leading-5 font-normal text-gray-700">
            {state.activity.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default DraftStatusHeader;
