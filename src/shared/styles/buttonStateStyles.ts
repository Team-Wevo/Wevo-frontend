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
 * 의견 제출 버튼 (Figma: Button/제출하기)
 * 제출 가능 시 main/300, hover·pressed 시 main/600으로 전환한다.
 */
export const PRESSABLE_SUBMIT_BUTTON_STATE_CLASS =
  "border-transparent bg-main-300 text-white shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] transition-[background-color,box-shadow] hover:bg-main-600 hover:shadow-none active:bg-main-600 active:shadow-none disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-100 disabled:shadow-none disabled:hover:bg-gray-100 disabled:hover:text-gray-600";

/**
 * 팀원 초대 링크 복사 버튼 (Figma: copy-btn)
 * 기본 테두리형에서 hover main/300, pressed main/600으로 전환한다.
 */
export const PRESSABLE_COPY_BUTTON_STATE_CLASS =
  "border-gray-500 bg-transparent text-gray-700 transition-[background-color,border-color,color,box-shadow] hover:border-transparent hover:bg-main-300 hover:text-white hover:shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] active:border-transparent active:bg-main-600 active:text-white active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-500 disabled:hover:bg-transparent disabled:hover:text-gray-700 disabled:hover:shadow-none";

/**
 * 모든 섹션 확정 후 사용하는 완성본 확인 버튼.
 * 비활성 main/50 → 활성 main/400 → hover·pressed main/600 순서로 전환한다.
 */
export const PRESSABLE_COMPLETION_BUTTON_STATE_CLASS =
  "border-transparent bg-main-400 text-gray-50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)] transition-[background-color,box-shadow] hover:bg-main-600 hover:shadow-none active:bg-main-600 active:shadow-none disabled:bg-main-50 disabled:text-gray-600 disabled:opacity-100 disabled:shadow-none disabled:hover:bg-main-50 disabled:hover:text-gray-600";

/**
 * AI 실행 버튼 (Figma: AI 읽힘 점검하기 / 현재 의견으로 AI 정리 시작)
 * 기본 흰 배경 + gray/5 테두리 → hover main/300 → pressed main/600.
 * 아이콘은 PRESSABLE_FILL_ICON_STATE_CLASS와 함께 써야 hover·pressed에서 흰색으로 바뀐다.
 */
export const PRESSABLE_AI_BUTTON_STATE_CLASS =
  "group border-gray-400 bg-white text-gray-800 transition-colors hover:border-transparent hover:bg-main-300 hover:text-white active:border-transparent active:bg-main-600 active:text-white disabled:hover:border-gray-400 disabled:hover:bg-white disabled:hover:text-gray-800";

/**
 * 초안·완성본 수정 버튼.
 * 기본 테두리형에서 hover main/300, pressed main/600으로 전환한다.
 */
export const PRESSABLE_EDIT_BUTTON_STATE_CLASS =
  "group border-gray-400 bg-gray-50 text-gray-700 transition-colors hover:border-transparent hover:bg-main-300 hover:text-white active:border-transparent active:bg-main-600 active:text-white disabled:hover:border-gray-400 disabled:hover:bg-gray-50 disabled:hover:text-gray-700";

/**
 * 화면의 대표 행동에 사용하는 Primary 버튼.
 * 기본 main/600 → hover main/700 → pressed main/800로 전환한다.
 */
export const PRESSABLE_PRIMARY_BUTTON_STATE_CLASS =
  "border-transparent bg-main-600 text-gray-50 transition-colors hover:bg-main-700 active:bg-main-800 disabled:border-transparent disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-100 disabled:hover:bg-gray-200";

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
