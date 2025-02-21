import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { fetchUserData } from "@/services/api/auth";

// ✅ API 응답 데이터 타입 정의
interface UserResponse {
  apartmentMonthlyAvgSuccess: Record<string, number>;
  userMonthlyAvgSuccess: Record<string, number>;
  monthlyMaterialSuccessRates: Record<string, { material: string; avg_success: number }[]>;
  recentAnalysis: { analysis_date: string; material: string; success_percent: number }[];
}

export default function RecyclingStats() {
  const [data, setData] = useState<UserResponse | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchUserData();
        
        if (!response) {
          throw new Error('로그인이 필요합니다');
        }

        if (
          'apartmentMonthlyAvgSuccess' in response &&
          'userMonthlyAvgSuccess' in response &&
          'monthlyMaterialSuccessRates' in response &&
          'recentAnalysis' in response
        ) {
          setData(response as UserResponse);
        } else {
          throw new Error('데이터 형식이 올바르지 않습니다');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다');
        console.error("데이터 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <p className="text-center text-gray-500">데이터를 불러오는 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!data) return <p className="text-center text-gray-500">데이터가 없습니다</p>;

  const nextCard = () => setCurrentCardIndex((prev) => (prev + 1) % 3);
  const prevCard = () => setCurrentCardIndex((prev) => (prev - 1 + 3) % 3);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">♻️ 분리배출 기록</h1>

      <motion.div
        className="relative w-[1000px] h-[600px] flex items-center justify-center overflow-hidden p-8 bg-white rounded-lg shadow-lg border border-green-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button onClick={prevCard} className="absolute left-[20px] top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition-all">
          ←
        </Button>

        <Button onClick={nextCard} className="absolute right-[20px] top-1/2 transform -translate-y-1/2 bg-gray-300 text-white px-6 py-3 rounded-full hover:bg-gray-500 transition-all">
          →
        </Button>

        <AnimatePresence mode="wait">
          {currentCardIndex === 0 ? (
            <motion.div key="weekly-graph-card" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5 }} className="absolute">
              <WeeklyGraphCard data={data.recentAnalysis} />
            </motion.div>
          ) : currentCardIndex === 1 ? (
            <motion.div key="monthly-graph-card" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5 }} className="absolute">
              <MonthlyGraphCard data={data.monthlyMaterialSuccessRates} />
            </motion.div>
          ) : (
            <motion.div key="ranking-graph-card" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5 }} className="absolute">
              <RankingGraphCard data={data} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// 📊 최근 분석 데이터 (요일별 성공률)
const WeeklyGraphCard = ({ data }: { data: UserResponse["recentAnalysis"] }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
    <h3 className="text-xl font-semibold text-center mb-4">📊 요일별 성공률</h3>
    <ResponsiveContainer width={700} height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="analysis_date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="success_percent" fill="#3498db" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// 📊 재질별 평균 성공률
const MonthlyGraphCard = ({ data }: { data: UserResponse["monthlyMaterialSuccessRates"] }) => {
  const selectedMonth = "202501"; // 현재 월 설정 가능
  const currentData = data[selectedMonth] || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
      <h3 className="text-xl font-semibold text-center mb-4">📊 {selectedMonth} 평균 성공률</h3>
      <ResponsiveContainer width={700} height={300}>
        <RadarChart data={currentData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="material" />
          <Radar name="평균 성공률" dataKey="avg_success" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 📊 월별 유저 vs 주민 평균 성공률
const RankingGraphCard = ({ data }: { data: UserResponse }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
    <h3 className="text-xl font-semibold text-center mb-4">📊 월 평균 주민 & 유저 데이터</h3>
    <ResponsiveContainer width={700} height={300}>
      <LineChart
        data={Object.entries(data.apartmentMonthlyAvgSuccess).map(([month, avg]) => ({
          month,
          주민평균: avg,
          유저평균: data.userMonthlyAvgSuccess[month] || 0,
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="주민평균" stroke="#2ecc71" strokeWidth={3} />
        <Line type="monotone" dataKey="유저평균" stroke="#3498db" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);