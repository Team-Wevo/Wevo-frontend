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

export const PRESSABLE_STROKE_ICON_STATE_CLASS =
  "group-hover:[&_path]:stroke-white group-active:[&_path]:stroke-white";

export const PRESSABLE_FILL_ICON_STATE_CLASS =
  "group-hover:[&_path]:fill-white group-active:[&_path]:fill-white";
