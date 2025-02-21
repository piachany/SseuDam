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

    // ✅ 사용자 정보 저장 (필드 매칭 수정)
    const userData: User = {
      uid: response.data.uid,
      email: response.data.email,
      nickname: response.data.nickname,
      created_at: response.data.created_at,
      last_login: response.data.last_login,
      isGuest: response.data.isGuest,
      role: response.data.role,
      grade: response.data.grade || "등급 없음", // ✅ 현재 등급 반영
      points_needed_for_promotion: response.data.pointsNeededForPromotion || response.data.points_needed_for_promotion || 0,
      accumulatedPoints: response.data.accumulatedPoints || 0,
      monthlyPoints: response.data.monthlyPoints || 0, // ✅ 월별 포인트 반영
      redirect_url: response.data.redirect_url || "/home",
      pointsNeededForPromotion: response.data.pointsNeededForPromotion || response.data.points_needed_for_promotion || 0
    };

    console.log("🟢 저장된 사용자 데이터:", userData);

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

    const response = await axios.get<LoginResponse>(`${API_BASE_URL}/api/users/me`, {
      headers: {
        "Authorization": firebaseToken, // ✅ Firebase 토큰 추가
        "Content-Type": "application/json",
      },
    });

    console.log("✅ 사용자 데이터 요청 성공:", response.data);

    // ✅ 서버에서 받은 응답을 변환하여 `User` 타입에 맞게 저장
    const userData: User = {
      uid: response.data.uid,
      email: response.data.email,
      nickname: response.data.nickname,
      created_at: response.data.created_at,
      last_login: response.data.last_login,
      isGuest: response.data.isGuest,
      role: response.data.role,
      grade: response.data.grade || "등급 없음",  // ✅ 현재 등급 반영
      points_needed_for_promotion: response.data.pointsNeededForPromotion || response.data.points_needed_for_promotion || 0,
      accumulatedPoints: response.data.accumulatedPoints || 0,
      monthlyPoints: response.data.monthlyPoints || 0,  // ✅ 월별 포인트 반영
      redirect_url: response.data.redirect_url || "/home",
      pointsNeededForPromotion: response.data.pointsNeededForPromotion || response.data.points_needed_for_promotion || 0
    };

    console.log("🟢 저장된 사용자 데이터:", userData);

    return userData;
  } catch (error) {
    console.error("❌ 사용자 데이터 가져오기 실패:", error);
    throw error;
  }
};

// ✅ 로그아웃 처리
export const logout = async (): Promise<void> => {
  try {
    await auth.signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    console.log("✅ 로그아웃 성공");
  } catch (error) {
    console.error("❌ 로그아웃 실패:", error);
    throw error;
  }
};
