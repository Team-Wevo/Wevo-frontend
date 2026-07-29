import { useState, type ReactNode } from "react";

type ContentType = "profile" | "general";

interface SettingProfileModalProps {
  contentType?: ContentType;
  profileContent?: ReactNode;
  generalContent?: ReactNode;
}

export const SettingProfileModal = ({
  contentType = "profile",
  profileContent,
  generalContent,
}: SettingProfileModalProps) => {
  // ❌ 에러를 일으키던 useEffect를 제거하고 바로 초기값으로 설정합니다.
  const [activeTab, setActiveTab] = useState<ContentType>(contentType);

  // 💡 사용하지 않는 description 변수도 깔끔하게 제거했습니다!

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* 탭 전환 버튼 영역 예시 */}
      <div className="flex border-b border-slate-200 px-6 py-4">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`mr-4 pb-2 text-sm font-medium transition ${
            activeTab === "profile"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          프로필 설정
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`pb-2 text-sm font-medium transition ${
            activeTab === "general"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          일반 설정
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "profile" ? profileContent : generalContent}
      </div>
    </div>
  );
};
