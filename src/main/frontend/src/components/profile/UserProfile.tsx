import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import * as LucideIcons from "lucide-react";
import { ComponentType } from "react";

interface UserProfileProps {
  userData: {
    nickname?: string;  // username을 nickname으로 변경
    email?: string;
    lastLogin?: string;
    createdAt?: string;
  };
}

interface UserData {
  nickname?: string;  // username을 nickname으로 변경
  email?: string;
  selectedIcon?: string;
  currentRank?: string;
  points?: number;
  nextRankPoints?: number;
  totalPoints?: number;
  monthlyPoints?: number;
  earnedPoints?: number;
  lastLogin?: string;
  createdAt?: string;
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
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError("로그인된 사용자가 없습니다.");
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const firestoreData = userDoc.data() as UserData;
          const mergedData = {
            ...initialUserData,
            ...firestoreData
          };
          setUser(mergedData);
          localStorage.setItem("user", JSON.stringify(mergedData));
        } else {
          setError("사용자 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("❌ 사용자 정보 가져오기 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [initialUserData]);

  const handleIconSelect = async (iconName: keyof typeof LucideIcons) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { selectedIcon: iconName });

      setUser((prev) => prev ? { ...prev, selectedIcon: iconName } : prev);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("❌ 아이콘 업데이트 실패:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-green-600 animate-pulse">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
        {error}
      </div>
    );
  }

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
          <p>가입일: {formatDate(initialUserData.createdAt)}</p>
          <p>마지막 로그인: {formatDate(initialUserData.lastLogin)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">현재 등급</p>
            <p className="text-lg font-semibold text-green-900">{user.currentRank || "등급 없음"}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">승급까지 필요한 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.nextRankPoints || 0} P</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">누적 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.totalPoints || 0} P</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">월별 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.monthlyPoints || 0} P</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">획득 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.earnedPoints || 0} P</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;