// src/store/useStore.ts
import { create } from "zustand";

// ✅ Zustand 상태에서 User 타입 수정
interface User {
  uid: string;
  email: string;
  nickname: string;
  created_at: string;
  last_login: string;
  isGuest: boolean;
  role: string;
  grade?: string;
  points_needed_for_promotion: number;
  pointsNeededForPromotion: number;
  accumulatedPoints?: number;
  monthlyPoints: number;
  redirect_url?: string;
}

interface RecyclingStats {
  successRate: number;
  totalWeight: number;
  lastAnalysis: string;
}

interface AppState {
  user: User | null;
  stats: RecyclingStats;
  setUser: (user: User | null) => void;
  restoreUserFromStorage: () => void;
  updateStats: (stats: Partial<RecyclingStats>) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  stats: {
    successRate: 90,
    totalWeight: 250,
    lastAnalysis: "",
  },

  // ✅ 로그인 시 Zustand 상태 + localStorage 동기화
  setUser: (user) => {
    set({ user });
    if (user) {
      console.log("✅ Zustand 상태 업데이트:", user);
      localStorage.setItem("userId", user.uid); // ✅ 로그인 시 UID 저장
      localStorage.setItem("user", JSON.stringify(user)); // ✅ 전체 사용자 데이터 저장
    } else {
      localStorage.removeItem("userId");
      localStorage.removeItem("user");
    }
  },

  // ✅ 앱 시작 시 localStorage에서 사용자 복구
  restoreUserFromStorage: () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        console.log("🔄 로컬 저장소에서 사용자 복구 시도:", parsedUser);
        
        setTimeout(() => { // ✅ 상태 업데이트 후 로그 확인
          set({ user: parsedUser });
          console.log("✅ Zustand 상태에 사용자 복구 완료:", parsedUser);
        }, 100);
        
      } catch (error) {
        console.error("❌ 로컬 저장소에서 사용자 복구 실패:", error);
      }
    } else {
      console.warn("⚠️ 로컬 저장소에서 사용자 정보 없음");
      set({ user: null }); // ✅ 사용자 정보가 없으면 null로 설정
    }
  },

  updateStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),
}));
