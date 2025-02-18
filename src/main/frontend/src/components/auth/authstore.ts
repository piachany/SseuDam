// src/components/auth/authstore.ts
import create from "zustand";
import { User } from "@/types/auth"; // ✅ 정확한 User 타입 import

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;  // user 또는 null
    clearUser: () => void;
    syncUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    setUser: (user) => {
        try {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                localStorage.removeItem("user"); // 사용자 정보 제거
            }
            set({ user });
        } catch (e) {
            console.error("Failed to save user to localStorage:", e);
        }
    },

    clearUser: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin"); // isAdmin도 함께 제거
        set({ user: null });
    },

    syncUser: () => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                set({ user: parsedUser });
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage:", error);
            localStorage.removeItem("user"); // 잘못된 데이터 제거
        }
    },
}));

// 애플리케이션이 실행될 때 자동으로 상태 복원
useAuthStore.getState().syncUser();