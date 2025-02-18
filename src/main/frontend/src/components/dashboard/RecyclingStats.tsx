import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from "recharts"

// 📊 카드 데이터 타입 정의
type Card = {
  date: string  // 날짜 형식 (예: "25-02-01")
  success: number
  material: string
  count: number
}

// 🌱 예시 카드 데이터 (실제 백엔드에서 받아올 데이터)
const weeklyData: Card[] = [
  { date: "25-02-01", success: 70, material: "플라스틱", count: 30 },
  { date: "25-02-07", success: 60, material: "종이", count: 20 },
  { date: "25-02-14", success: 80, material: "유리", count: 35 },
  { date: "25-02-21", success: 65, material: "캔", count: 25 },
  { date: "25-02-28", success: 69, material: "유리", count: 40 }
]

// 월간 데이터 (재질별 배출 횟수)
const monthlyData = [
  { material: "플라스틱", count: 50 },
  { material: "종이", count: 40 },
  { material: "유리", count: 60 },
  { material: "캔", count: 30 }
]

// 🎨 재질별 색상 헬퍼 (점 색상 결정)
const getColor = (material: string) => {
  const colors: { [key: string]: string } = {
    "플라스틱": "#3498db", // 파랑색
    "종이": "#2ecc71",     // 초록색
    "유리": "#e67e22",     // 주황색
    "캔": "#e74c3c"        // 빨간색
  }
  return colors[material] || "#7f8c8d"  // 기본 회색
}

// 색상 안내 (상단에 각 재질의 색상 표시)
const ColorLegend = () => (
  <div className="flex justify-center gap-4 mb-4">
    <div className="flex items-center">
      <span className="w-4 h-4 mr-2 bg-blue-500 rounded-full"></span> 플라스틱
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 mr-2 bg-green-500 rounded-full"></span> 종이
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 mr-2 bg-orange-500 rounded-full"></span> 유리
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 mr-2 bg-red-500 rounded-full"></span> 캔
    </div>
  </div>
)

// 요일별 성공률 그래프 카드
const WeeklyGraphCard = ({ data }: { data: Card[] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-200 mb-8">
      {/* 색상 안내 추가 */}
      <ColorLegend />

      <h3 className="text-xl font-semibold text-center mb-4">요일별 성공률</h3>
      <ResponsiveContainer width={700} height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" /> {/* 날짜 표시 */}
          <YAxis domain={[0, 100]} /> {/* Y축 최대값 100%로 설정 */}
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          {/* 함수 모양처럼 점을 연결하는 선 */}
          <Line
            type="monotone"
            dataKey="success"
            stroke="#8884d8"
            fill="#8884d8"
            dot={(props) => {
              const { cx, cy, payload } = props;
              const color = getColor(payload.material); // 재질에 맞는 색상 설정
              return <circle cx={cx} cy={cy} r={5} fill={color} />
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 재질별 배출 횟수 그래프 카드
const MonthlyGraphCard = ({ data }: { data: { material: string, count: number }[] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-200 mb-8">
      {/* 색상 안내 추가 */}
      <ColorLegend />

      <h3 className="text-xl font-semibold text-center mb-4">재질별 배출 횟수</h3>
      <ResponsiveContainer width={700} height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="material" /> {/* 재질 */}
          <YAxis domain={[0, 100]} /> {/* Y축 최대값 100%로 설정 */}
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          {/* 막대 그래프 */}
          <Bar dataKey="count" fill="#3498db">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.material)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function RecyclingStats() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  // 요일별 성공률과 재질별 배출 횟수 데이터
  const weeklyDataState = weeklyData
  const monthlyDataState = monthlyData

  // 카드를 전환하는 함수
  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % 2)
  }

  const prevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + 2) % 2)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-8 text-gray-800">♻️ 분리배출 기록</h1>

      {/* 카드 섹션 */}
      <div className="relative w-[1000px] h-[600px] flex items-center justify-center overflow-hidden p-8 bg-white rounded-lg shadow-lg border border-green-300">
        {/* 좌우 버튼을 카드 내부로 이동 */}
        <Button
          onClick={prevCard}
          className="absolute left-[20px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-lime-300 to-blue-400 text-white px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 ease-in-out shadow-lg"
        >
          ←
        </Button>
        <Button
          onClick={nextCard}
          className="absolute right-[20px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-lime-300 to-blue-400 text-white px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 ease-in-out shadow-lg"
        >
          →
        </Button>

        {/* 애니메이션 처리된 카드 섹션 */}
        <AnimatePresence mode="wait">
          {/* 카드 전환 애니메이션 */}
          {currentCardIndex === 0 ? (
            <motion.div
              key="weekly-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <WeeklyGraphCard data={weeklyDataState} />
            </motion.div>
          ) : (
            <motion.div
              key="monthly-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <MonthlyGraphCard data={monthlyDataState} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
