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
        set({ user: JSON.parse(storedUser) });
      }
    } catch (e) {
      console.error("Invalid JSON in localStorage:", e);
      localStorage.removeItem("user");
    }
  },
}));

useAuthStore.getState().syncUser();
