import { useState, useEffect } from "react";
import api from "@/api/axiosInstance";

interface UserData {
  grade: string;
  points: number;
  nextLevelPoints: number;
}

export function RecyclingStats() {
  const [user, setUser] = useState<UserData>({
    grade: "등급 없음",
    points: 0,
    nextLevelPoints: 0,
  });

  useEffect(() => {
    api.get<UserData>("/user")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("API 요청 오류:", err));
  }, []);

  return (
    <div className="bg-green-100 min-h-screen flex flex-col items-center justify-center p-6 font-quicksand">
      {/* 🔹 환경 보호 등급 정보 */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center border border-green-300 shadow-green-400">
        <h2 className="text-2xl font-bold text-green-900 mb-6">🌿 환경 보호등급 정보</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg shadow-md border border-green-200">
            <p className="text-sm text-green-700">현재 등급</p>
            <p className="text-3xl font-semibold text-green-900">{user.grade}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-md border border-green-200">
            <p className="text-sm text-green-700">승급까지 필요한 포인트</p>
            <p className="text-3xl font-semibold text-green-900">
              {user.nextLevelPoints > 0 ? `${user.nextLevelPoints} P` : "최고 등급"}
            </p>
          </div>
        </div>
      </div>

      {/* 🔹 분리배출 통계 */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mt-8 text-center border border-green-300 shadow-green-400">
        <h2 className="text-2xl font-bold text-green-900 mb-6">♻️ 최근 분리배출 기록</h2>
        <p className="text-green-700 mb-4">분리배출 성공률 차트 및 배출 횟수</p>

        {/* 🔹 분리배출 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg shadow-md border border-green-200 flex flex-col items-center">
            <p className="text-sm text-green-700">분리배출 성공률</p>
            <p className="text-4xl font-semibold text-green-900">90%</p> {/* 예제 값 */}
            <p className="text-green-700 text-sm mt-2 bg-green-100 px-2 py-1 rounded">
              가장 잘 분리배출한 재질: 플라스틱 {/* 예제 값 */}
            </p>
          </div>

          {/* 🔹 차트 영역 */}
          <div className="aspect-square bg-green-200 rounded-lg flex items-center justify-center text-green-700">
            📊 차트 영역 {/* 차트 라이브러리 활용 가능 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecyclingStats;
