import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { BellIcon, UserIcon, TrashIcon, LogOutIcon } from "lucide-react"


export function SettingsPage() {
  const navigate = useNavigate()
  const [isPushEnabled, setIsPushEnabled] = useState(true)

  return (
    <div className="w-[400px] mx-auto min-h-screen flex flex-col bg-gray-50 text-gray-900 overflow-hidden shadow-xl rounded-xl">
      {/* 🔝 헤더 */}
      <div className="flex items-center justify-between px-6 py-5 bg-white shadow-md rounded-t-xl">
        <button onClick={() => navigate(-1)} className="text-gray-600 text-lg">←</button>
        <h1 className="text-xl font-semibold">설정</h1>
        <div className="w-6"></div> {/* 우측 정렬 맞추기 */}
      </div>

      {/* ⚙️ 설정 목록 */}
      <div className="mt-4 bg-white shadow-md rounded-xl flex-1 overflow-auto divide-y">
        <SettingItem icon={<UserIcon size={22} />} text="비밀번호 재설정" onClick={() => navigate("/settings/account")} />
        <SettingItem icon={<BellIcon size={22} />} text="알림 설정">
          <ToggleSwitch isEnabled={isPushEnabled} onToggle={() => setIsPushEnabled(!isPushEnabled)} />
        </SettingItem>
        <SettingItem icon={<LogOutIcon size={22} />} text="로그아웃" onClick={() => navigate("/auth")} />

        {/* 🔴 회원탈퇴 (더 작고 눈에 덜 띄게) */}
        <SettingItem 
          icon={<TrashIcon size={18} />} 
          text="회원탈퇴" 
          textColor="text-red-400 text-sm" 
          className="py-3 px-4 opacity-80"
          onClick={() => navigate("/auth")} 
        />
      </div>
    </div>
  )
}

/* ✅ 리스트 아이템 */
function SettingItem({ icon, text, onClick, children, textColor = "text-gray-900", className = "" }: { icon: React.ReactNode, text: string, onClick?: () => void, children?: React.ReactNode, textColor?: string, className?: string }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-6 py-4 ${className} transition cursor-pointer`}
    >
      <div className="flex items-center space-x-4">
        {icon}
        <span className={`font-medium ${textColor}`}>{text}</span>
      </div>
      {children || <span className="text-gray-400 text-lg">›</span>}
    </div>
  )
}

/* ✅ 토글 스위치 */
function ToggleSwitch({ isEnabled, onToggle }: { isEnabled: boolean, onToggle: () => void }) {
  return (
    <div
      className={`w-14 h-7 flex items-center rounded-full cursor-pointer p-1 transition-all ${
        isEnabled ? "bg-blue-500" : "bg-gray-300"
      }`}
      onClick={onToggle}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
          isEnabled ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </div>
  )
}
