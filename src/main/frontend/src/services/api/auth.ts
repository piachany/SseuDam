// src/services/api/auth.ts
import axios from "axios";
import { LoginRequest, LoginResponse, User } from "@/types/auth";
import { auth } from "@/lib/firebase/firebase"; // ✅ Firebase 인증 추가

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.100.5:8080";

// ✅ Firebase 사용자 토큰 가져오기
const getFirebaseToken = async (): Promise<string> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("🚫 Firebase 사용자 인증이 필요합니다.");

  const idToken = await currentUser.getIdToken(true); // ✅ 최신 토큰 가져오기
  return `Bearer ${idToken}`;
};

// ✅ 로그인 요청
export const login = async (loginData: LoginRequest): Promise<User> => {
  try {
    console.log("🚀 로그인 요청:", loginData);

    // ✅ Firebase 토큰 가져오기
    const firebaseToken = await getFirebaseToken();
    console.log("🔑 Firebase 토큰:", firebaseToken);

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/users/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": firebaseToken, // ✅ Firebase 토큰 추가
        },
        withCredentials: true,
      }
    );

    console.log("✅ 서버 응답:", response.data);

    // ✅ JWT 토큰 저장
    const newToken = response.headers["authorization"];
    if (newToken) {
      localStorage.setItem("token", newToken.replace("Bearer ", ""));
    }

    // ✅ 사용자 정보 저장
    const userData: User = {
      uid: response.data.uid,
      email: response.data.email,
      nickname: response.data.nickname,
      createdAt: response.data.created_at,
      lastLogin: response.data.last_login,
      isGuest: false,
      role: "user",
    };

    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  } catch (error: any) {
    console.error("❌ 로그인 요청 에러:", error);

    if (error.response?.status === 401) throw new Error("🚫 인증이 필요합니다.");
    if (error.response?.status === 400) throw new Error("❌ 이메일 또는 비밀번호가 올바르지 않습니다.");
    throw new Error("⚠️ 로그인에 실패했습니다.");
  }
};

// ✅ 로그인 후 사용자 데이터 가져오기 (Firebase 토큰 인증)
export const fetchUserData = async (): Promise<User> => {
  try {
    const firebaseToken = await getFirebaseToken(); // ✅ Firebase 토큰 가져오기
    console.log("🔍 사용자 데이터 요청 중...");

    const response = await axios.get<User>(`${API_BASE_URL}/api/users/me`, {
      headers: {
        "Authorization": firebaseToken, // ✅ Firebase 토큰 추가
        "Content-Type": "application/json",
      },
    });

    console.log("✅ 사용자 데이터 요청 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 사용자 데이터 가져오기 실패:", error);
    throw error;
  }
};
