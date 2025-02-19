import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import * as LucideIcons from "lucide-react";
import { ComponentType } from "react";

interface UserProfileProps {
  userData: {
    nickname?: string;
    email?: string;
    selectedIcon?: string;
    grade?: string;
    current_tier?: string;
    points_needed_for_promotion: number;
    points: number;
    monthly_points?: number;
    accumulatedPoints?: number;
    monthlyPoints: number;
    earnedPoints?: number;
    last_login?: string;
    created_at?: string;
  };
}

const availableIcons = Object.keys(LucideIcons)
  .filter((icon) => typeof (LucideIcons as any)[icon] === "function")
  .slice(0, 20) as Array<keyof typeof LucideIcons>;

const formatDate = (dateString?: string) => {
  if (!dateString) return "정보 없음";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export function UserProfile({ userData: initialUserData }: UserProfileProps) {
  const [user, setUser] = useState(initialUserData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleIconSelect = async (iconName: keyof typeof LucideIcons) => {
    try {
      const response = await fetch('/api/user/update-icon', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIcon: iconName }),
      });

      if (!response.ok) {
        throw new Error('아이콘 업데이트 실패');
      }

      setUser(prev => ({ ...prev, selectedIcon: iconName }));
      setIsDialogOpen(false);
    } catch (err) {
      console.error("❌ 아이콘 업데이트 실패:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-green-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center border border-green-300 shadow-green-400">
        <div className="text-center text-green-700 bg-green-200 p-4 rounded-md mb-6">
          <p className="font-semibold text-lg">♻️ 환경을 위한 친환경 분리배출을 시작하세요!</p>
          <p className="text-sm">지속 가능한 지구를 위한 작은 실천이 큰 변화를 만듭니다.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="relative w-24 h-24 mx-auto cursor-pointer bg-green-200 flex items-center justify-center rounded-full border-2 border-green-400 shadow-md hover:bg-green-300 transition-all">
              {user.selectedIcon && availableIcons.includes(user.selectedIcon as keyof typeof LucideIcons) ? (
                (() => {
                  const IconComponent = LucideIcons[user.selectedIcon as keyof typeof LucideIcons] as ComponentType<any>;
                  return <IconComponent size={48} className="text-green-800" />;
                })()
              ) : (
                <span className="text-green-800 text-5xl">{(user.nickname || "U")[0].toUpperCase()}</span>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">아이콘 선택</h2>
            <div className="grid grid-cols-4 gap-4">
              {availableIcons.map((icon) => {
                const IconComponent = LucideIcons[icon] as ComponentType<any>;
                return (
                  <button
                    key={icon}
                    className="p-3 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
                    onClick={() => handleIconSelect(icon)}
                  >
                    <IconComponent size={32} className="text-green-800" />
                  </button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        <h2 className="text-2xl font-bold mt-4 text-green-900">{user.nickname || "사용자"}</h2>
        <p className="text-green-700">{user.email}</p>

        <div className="mt-4 space-y-2 text-sm text-green-600">
          <p>가입일: {formatDate(user.created_at)}</p>
          <p>마지막 로그인: {formatDate(user.last_login)}</p>
        </div>

        {/* ✅ 현재 등급 및 승급까지 필요한 포인트 */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">현재 등급</p>
            <p className="text-lg font-semibold text-green-900">{user.grade || "등급 없음"}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">승급까지 필요한 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.points_needed_for_promotion || 0} P</p>
          </div>
        </div>

        {/* ✅ 누적 포인트 및 월별 포인트 (현재 등급 아래로 정렬) */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">누적 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.accumulatedPoints || 0} P</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">월별 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.monthlyPoints || 0} P</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
