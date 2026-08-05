import { useLayoutEffect, useState } from "react";
import { Button } from "../../../../shared/components/Button";
import { cn } from "../../../../shared/utils/cn";

interface OnboardingStep {
  title: string;
  description: string;
  position: string;
  // 고정 위치는 highlightPosition(Tailwind 클래스), 실제 DOM 요소 기준으로 잡을 땐
  // highlightTarget(data-onboarding-highlight 값)을 씀 — 한 단계엔 하나만 지정
  highlightPosition?: string;
  highlightTarget?: string;
  confirmLabel: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "작성 흐름",
    description:
      "제안서를 이루는 섹션들을 하나씩 채워가는 공간이에요. 모든 섹션을 완성하면 아래 '완성본 확인' 기능에서 결과물을 볼 수 있어요.",
    position: "top-20 left-64",
    highlightPosition: "top-14 left-0 h-[calc(100%-56px)] w-[220px]",
    confirmLabel: "다음",
  },
  {
    title: "의견 작성",
    description:
      "현재 섹션의 질문에 따라 내 의견을 자유롭게 작성하는 공간이에요. 의견을 제출하면 팀원들의 의견도 함께 확인할 수 있어요.",
    position: "bottom-32 left-[calc(50%-34px)] -translate-x-1/2",
    highlightTarget: "opinion-box",
    confirmLabel: "다음",
  },
  {
    title: "프로젝트 정보",
    description:
      "결과물 유형, 전달 대상, 시작 아이디어 등 프로젝트의 핵심 정보를 모아 놓았어요.",
    position: "top-20 right-84",
    highlightPosition: "top-14 right-0 h-[calc(100%-56px)] w-72",
    confirmLabel: "시작하기",
  },
];

const HIGHLIGHT_PADDING = 24;

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface WorkspaceOnboardingProps {
  onFinish: () => void;
}

const WorkspaceOnboarding = ({ onFinish }: WorkspaceOnboardingProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(
    null,
  );
  const step = ONBOARDING_STEPS[stepIndex];
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1;

  useLayoutEffect(() => {
    if (!step.highlightTarget) {
      return;
    }

    const measure = () => {
      const target = document.querySelector(
        `[data-onboarding-highlight="${step.highlightTarget}"]`,
      );

      if (!target) {
        setHighlightRect(null);
        return;
      }

      const rect = target.getBoundingClientRect();
      setHighlightRect({
        top: rect.top - HIGHLIGHT_PADDING,
        left: rect.left - HIGHLIGHT_PADDING,
        width: rect.width + HIGHLIGHT_PADDING * 2,
        height: rect.height + HIGHLIGHT_PADDING * 2,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [step.highlightTarget]);

  const handleConfirm = () => {
    if (isLastStep) {
      onFinish();
      return;
    }

    setStepIndex((current) => current + 1);
  };

  return (
    <>
      {step.highlightTarget ? (
        highlightRect && (
          <div
            className="pointer-events-none fixed z-40 rounded-[16px] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
            style={{
              top: highlightRect.top,
              left: highlightRect.left,
              width: highlightRect.width,
              height: highlightRect.height,
            }}
          />
        )
      ) : (
        <div
          className={cn(
            "pointer-events-none fixed z-40 rounded-[16px] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]",
            step.highlightPosition,
          )}
        />
      )}

      <div
        className={cn(
          "fixed z-50 flex w-80 flex-col gap-5 rounded-[12px] bg-gray-50 p-5 shadow-[0px_20px_48px_-8px_rgba(0,0,0,0.12)]",
          step.position,
        )}
      >
        <span className="text-main text-xs">
          {stepIndex + 1} / {ONBOARDING_STEPS.length}
        </span>

        <h3 className="text-[16px] text-gray-900">{step.title}</h3>
        <p className="text-[13px] leading-5 font-[500] text-gray-700">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onFinish}
            className="cursor-pointer text-xs leading-[15px] text-gray-600"
          >
            건너뛰기
          </button>
          <Button
            type="main"
            onClick={handleConfirm}
            className="text-xs leading-[15px] font-medium"
          >
            {step.confirmLabel}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WorkspaceOnboarding;
