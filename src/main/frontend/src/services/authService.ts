import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  UserCredential
} from "firebase/auth";
import { auth, db } from "@/lib/firebase/firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
} from "firebase/firestore";

// 타입 정의
interface UserData {
  email: string;
  username: string;
  role: "user" | "admin";
  created_at: string;
  points?: number;
  recycleCount?: number;
  updated_at?: string;
  last_login?: string;
  address?: string;
  monthlyPoints?: number;
  accumulatedPoints?: number;
  redirect_url?: string;
  token?: string;
  grade?: string;
  points_needed_for_promotion: number;
  isGuest: boolean;
  nickname: string;
  monthly_points: number;
  uid: string;
}
interface ActivityLog {
  userId: string;
  action: string;
  timestamp: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
  };
}

// 회원가입
export const signUpUser = async (
  email: string, 
  password: string, 
  username: string,
  address?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Firestore에 사용자 정보 저장
    const userData: UserData = {
      email: user.email!,
      username,
      role: "user",
      points: 0,
      recycleCount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      address,
      isGuest: false, // isGuest 속성 추가
      nickname: username, // nickname 속성 추가
      monthly_points: 0, // monthly_points 속성 추가
      uid: user.uid,
      points_needed_for_promotion: 0
    };

    await setDoc(doc(db, "users", user.uid), userData);
    await logUserActivity(user.uid, "register");

    // 초기 랭킹 정보 생성
    await setDoc(doc(db, "rank_accounts", user.uid), {
      username,
      address,
      month: new Date().getMonth() + 1,
      monthly_points: 0,
      accumulated_points: 0,
      ranking: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return userCredential;
  } catch (error: any) {
    console.error("회원가입 실패:", error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("이미 등록된 이메일입니다. 로그인을 시도해주세요.");
    } else if (error.code === 'auth/invalid-email') {
      throw new Error("유효하지 않은 이메일 형식입니다.");
    } else if (error.code === 'auth/weak-password') {
      throw new Error("비밀번호는 최소 6자 이상이어야 합니다.");
    }
    throw error;
  }
};

// 로그인
export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 로그인 시간 업데이트
    await setDoc(
      doc(db, "users", user.uid), 
      { lastLogin: serverTimestamp() },
      { merge: true }
    );

    // 로그인 세션 생성
    await setDoc(doc(db, "user_sessions", `${user.uid}_${Date.now()}`), {
      userId: user.uid,
      loginTime: serverTimestamp(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      },
      status: 'active'
    });

    await logUserActivity(user.uid, "login");

    // 🔹 토큰 반환
    const token = await user.getIdToken();
    console.log("✅ 로그인 성공! 사용자 토큰:", token);

    return userCredential;
  } catch (error: any) {
    console.error("로그인 실패:", error);
    
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error("등록되지 않은 이메일입니다. 회원가입을 진행해주세요.");
      case 'auth/wrong-password':
        throw new Error("비밀번호가 일치하지 않습니다.");
      case 'auth/invalid-credential':
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
      case 'auth/user-disabled':
        throw new Error("비활성화된 계정입니다. 관리자에게 문의하세요.");
      case 'auth/too-many-requests':
        throw new Error("너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.");
      default:
        throw new Error("로그인 중 알 수 없는 오류가 발생했습니다.");
    }
  }
};

// 로그아웃
export const logoutUser = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (user) {
      await logUserActivity(user.uid, "logout");
    }
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw error;
  }
};

// 사용자 정보 가져오기
export const getUserData = async (userId: string): Promise<UserData> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (!userDoc.exists()) {
      const defaultUserData: UserData = {
        email: auth.currentUser?.email || '',
        username: auth.currentUser?.email?.split('@')[0] || '사용자',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        points: 0,
        recycleCount: 0,
        isGuest: false,
        nickname: auth.currentUser?.email?.split('@')[0] || '사용자',
        monthly_points: 0,
        uid: userId,
        grade: "일반",
        points_needed_for_promotion: 0,
        monthlyPoints: 0,
        accumulatedPoints: 0,
        redirect_url: "/home"
      };

      await setDoc(doc(db, "users", userId), defaultUserData);
      return defaultUserData;
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    return {
      email: auth.currentUser?.email || '',
      username: auth.currentUser?.email?.split('@')[0] || '사용자',
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      points: 0,
      recycleCount: 0,
      isGuest: false,
      nickname: auth.currentUser?.email?.split('@')[0] || '사용자',
      monthly_points: 0,
      uid: userId,
      grade: "일반",
      points_needed_for_promotion: 0,
      monthlyPoints: 0,
      accumulatedPoints: 0
    };
  }
};

// 사용자 활동 로깅
export const logUserActivity = async (userId: string, action: string): Promise<void> => {
  try {
    const activityLog: ActivityLog = {
      userId,
      action,
      timestamp: new Date().toISOString(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      }
    };

    await setDoc(
      doc(db, "user_activity_logs", `${userId}_${Date.now()}`),
      {
        ...activityLog,
        createdAt: serverTimestamp()
      }
    );
  } catch (error) {
    console.error("활동 로그 기록 실패:", error);
  }
};

export default {
  signUpUser,
  loginUser,
  logoutUser,
  getUserData,
  logUserActivity
};
