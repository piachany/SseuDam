import create from "zustand";

interface User {
  uid: string;
  email?: string;
  username?: string;
  lastLogin?: string;
  token?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  syncUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
      set({ user });
    } catch (e) {
      console.error("Failed to save user to localStorage:", e);
    }
  },

  clearUser: () => {
    localStorage.removeItem("user");
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

// ✅ 애플리케이션이 실행될 때 자동으로 상태 복원
useAuthStore.getState().syncUser();
