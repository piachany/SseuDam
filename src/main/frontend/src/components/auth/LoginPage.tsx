import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/components/auth/authstore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { login } from "@/services/api/auth";
import { User } from "@/types/auth";
import { auth } from "@/lib/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";

interface LoginError extends Error {
  message: string;
}
    
// Admin 사용자를 위한 확장된 인터페이스
interface AdminUserData extends User {
  uid: string;
  email: string;
  nickname: string;
  created_at: string;
  last_login: string;
  monthly_points: number;
  isGuest: false;
  role: "admin";
  token: string;
  points_needed_for_promotion: number;
  grade: string;
  accumulatedPoints: number;
  monthlyPoints: number;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Bypass 로그인 (개발용)
  const bypassLogin = () => {
    const bypassUserData: User = {
        uid: 'bypass-user',
        email: 'bypass@example.com',
        nickname: 'Bypass User',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        monthlyPoints: 0,
        isGuest: false,
        role: 'user',
        token: 'bypass-token',
        points_needed_for_promotion: 0,
        grade: "일반",
        accumulatedPoints: 0,
        redirect_url: "/home",
        pointsNeededForPromotion: 0
    };
    setUser(bypassUserData);
    navigate("/home");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // ✅ Firebase 사용자 로그인
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      if (!firebaseUser) throw new Error("🚫 Firebase 사용자 인증 실패");

      // ✅ Firebase 토큰 가져오기
      const idToken = await firebaseUser.getIdToken(true);
      localStorage.setItem("token", idToken);

      // ✅ Firestore에서 유저 데이터 가져오기
      const db = getFirestore();
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userDataFromFirestore = userDocSnapshot.data();

        if (userDataFromFirestore.role === "admin") {
          const adminUserData: AdminUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              nickname: userDataFromFirestore.nickname,
              created_at: userDataFromFirestore.createdAt,
              last_login: userDataFromFirestore.lastLogin,
              monthly_points: userDataFromFirestore.monthly_points || 0,
              points_needed_for_promotion: 0,
              grade: "관리자",
              accumulatedPoints: 0,
              monthlyPoints: 0,
              isGuest: false,
              role: "admin",
              token: idToken,
              pointsNeededForPromotion: 0
          };

          setUser(adminUserData);
          localStorage.setItem("user", JSON.stringify(adminUserData));
          localStorage.setItem("isAdmin", "true");
          navigate("/admin");
          return;
        }
      }

      // ✅ 백엔드 로그인 요청 (Firebase 토큰 포함)
      const response = await login({ email, password });

      const userData: User = {
          uid: response.uid,
          email: response.email,
          nickname: response.nickname,
          created_at: response.created_at,
          last_login: response.last_login,
          monthlyPoints: response.monthlyPoints,
          points_needed_for_promotion: response.points_needed_for_promotion,
          grade: response.grade,
          accumulatedPoints: response.accumulatedPoints,
          isGuest: false,
          role: response.role,
          token: idToken,
          pointsNeededForPromotion: 0
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAdmin", "false");
      navigate(response.redirect_url || "/home");
    } catch (error) {
      console.error("🚨 로그인 에러:", error);
      const loginError = error as LoginError;
      setError(loginError.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const currentTime = new Date().toISOString();
    const guestData: User = {
        uid: `guest-${Date.now()}`,
        email: "",
        nickname: "게스트",
        created_at: currentTime,
        last_login: currentTime,
        isGuest: true,
        role: "user",
        token: `guest-${Date.now()}`,
        monthlyPoints: 0,
        points_needed_for_promotion: 0,
        grade: "일반",
        accumulatedPoints: 0,
        redirect_url: "/home",
        pointsNeededForPromotion: 0
    };
    setUser(guestData);
    navigate("/home");
  };

  return (
    <Card className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-8 py-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">로그인</h2>
          <p className="mt-2 text-sm text-gray-600">계정에 로그인하세요</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="button"
          onClick={bypassLogin}
          className="w-full h-10 mb-4 bg-green-500 text-white hover:bg-green-600"
        >
          Bypass Login (개발용)
        </Button>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin mr-2" />}
            {isLoading ? "처리 중..." : "로그인"}
          </Button>
        </form>

        <div className="mt-6">
          <Button
            type="button"
            onClick={handleGuestLogin}
            className="w-full h-10 bg-gray-600 text-white hover:bg-gray-700"
            disabled={isLoading}
          >
            게스트로 체험하기
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default LoginPage;