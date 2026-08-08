export const PRESSABLE_BUTTON_STATE_CLASS =
  "group border-gray-400 bg-white text-gray-800 transition-colors hover:border-white hover:bg-main-300 hover:text-white active:border-white active:bg-main-500 active:text-white";

export const PRESSABLE_RECT_BUTTON_STATE_CLASS =
  "bg-gray-50 text-[13px] leading-[18px] font-medium text-gray-700 hover:border-transparent hover:shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] active:border-transparent active:shadow-none disabled:hover:border-gray-400 disabled:hover:bg-gray-50 disabled:hover:text-gray-700 disabled:hover:shadow-none";

/**
 * 입력창 전송 버튼 (Figma: Button/Send)
 * 전송 가능해지는 순간 main/400으로 바뀌어 활성 상태임을 알리고, hover 시 main/700으로 진해진다.
 * 전송 불가(비활성)일 때는 gray/2로 남는다.
 * 아이콘은 stroke가 currentColor라 text 색상만 바꾸면 함께 반응한다.
 */
export const PRESSABLE_SEND_BUTTON_STATE_CLASS =
  "bg-main-400 text-gray-50 drop-shadow-[2px_2px_5px_rgba(0,0,0,0.2)] transition-[background-color,filter] hover:bg-main-700 hover:drop-shadow-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:drop-shadow-none disabled:hover:bg-gray-100 disabled:hover:text-gray-500";

/**
 * AI 실행 버튼 (Figma: AI 읽힘 점검하기 / 현재 의견으로 AI 정리 시작)
 * 기본 흰 배경 + gray/5 테두리 → hover main/300 → pressed main/600.
 * 아이콘은 PRESSABLE_FILL_ICON_STATE_CLASS와 함께 써야 hover·pressed에서 흰색으로 바뀐다.
 */
export const PRESSABLE_AI_BUTTON_STATE_CLASS =
  "group border-gray-400 bg-white text-gray-800 transition-colors hover:border-transparent hover:bg-main-300 hover:text-white active:border-transparent active:bg-main-600 active:text-white disabled:hover:border-gray-400 disabled:hover:bg-white disabled:hover:text-gray-800";

/*
 * 아이콘 색 전환은 버튼이 비활성일 때 일어나면 안 된다.
 * CSS :hover는 disabled 버튼에도 매칭되므로 :not(:disabled)로 직접 걸러낸다.
 */
export const PRESSABLE_STROKE_ICON_STATE_CLASS =
  "[.group:hover:not(:disabled)_&_path]:stroke-white [.group:active:not(:disabled)_&_path]:stroke-white";

export const PRESSABLE_FILL_ICON_STATE_CLASS =
  "[.group:hover:not(:disabled)_&_path]:fill-white [.group:active:not(:disabled)_&_path]:fill-white";

export const PRESSABLE_CHIP_STATE_CLASS =
  "border-gray-400 bg-gray-50 text-gray-700 hover:bg-main-50 hover:text-gray-900 active:border-main-600 active:bg-main-50 active:text-main-600";

export const SELECTED_CHIP_STATE_CLASS =
  "border-main-600 bg-main-50 text-main-600";
