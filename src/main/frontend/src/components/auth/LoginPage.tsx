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

export function LoginPage() {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const bypassLogin = () => {
        const bypassUserData: User = {
            uid: 'bypass-user',
            email: 'bypass@example.com',
            nickname: 'Bypass User',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            monthly_points: 0,
            isGuest: false,
            role: 'user',
            token: 'bypass-token' // token 추가
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
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            if (!firebaseUser) throw new Error("Firebase 사용자 인증 실패");

            const idToken = await firebaseUser.getIdToken(true);
            localStorage.setItem("token", idToken);

            const db = getFirestore();
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            if (userDocSnapshot.exists()) {
                const userDataFromFirestore = userDocSnapshot.data();

                if (userDataFromFirestore.role === "admin") {
                    const userData: User = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || "",
                        nickname: userDataFromFirestore.nickname,
                        createdAt: userDataFromFirestore.createdAt,
                        lastLogin: userDataFromFirestore.lastLogin,
                        monthly_points: userDataFromFirestore.monthly_points || 0,
                        isGuest: false,
                        role: "admin",
                        token: idToken // idToken 사용
                    };

                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("isAdmin", "true");
                    navigate("/admin");
                } else {
                    const response = await login({ email, password });

                    const userData: User = {
                        uid: response.uid,
                        email: response.email,
                        nickname: response.nickname,
                        createdAt: response.createdAt,
                        lastLogin: response.lastLogin,
                        monthly_points: response.monthly_points,
                        isGuest: false,
                        role: "user",
                        token: idToken // idToken 사용
                    };

                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("isAdmin", "false");
                    navigate("/home");
                }
            } else {
                const response = await login({ email, password });

                const userData: User = {
                    uid: response.uid,
                    email: response.email,
                    nickname: response.nickname,
                    createdAt: response.createdAt,
                    lastLogin: response.lastLogin,
                    monthly_points: response.monthly_points,
                    isGuest: false,
                    role: "user",
                    token: idToken // idToken 사용
                };

                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("isAdmin", "false");
                navigate("/home");
            }
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
            createdAt: currentTime,
            lastLogin: currentTime,
            isGuest: true,
            role: "user",
            token: `guest-${Date.now()}` // 게스트용 token 추가
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