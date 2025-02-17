// fetchWithAuth.ts
import { useAuthStore } from "@/components/auth/authstore";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const authUser = useAuthStore.getState().user;
  const token = authUser?.token;

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인해주세요.");
  }

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      useAuthStore.getState().clearUser();
      throw new Error("인증이 만료되었습니다. 다시 로그인해 주세요.");
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}