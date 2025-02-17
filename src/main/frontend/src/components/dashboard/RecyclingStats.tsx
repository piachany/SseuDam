import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

// 📊 카드 데이터 타입 정의
type Card = {
  date: string
  dayOfWeek?: string
  success: number
  material: string
  count: number
  summary?: string
  chartData?: { name: string; count: number; success: number }[]
}

// 🌱 테스트용 카드 데이터
const cardData: Card[] = [
  { date: "2025-02-05", dayOfWeek: "월", success: 70, material: "플라스틱", count: 30 },
  { date: "2025-02-12", dayOfWeek: "화", success: 60, material: "종이", count: 20 },
  { date: "2025-02-19", dayOfWeek: "수", success: 80, material: "유리", count: 35 },
  { date: "2025-02-26", dayOfWeek: "목", success: 65, material: "캔", count: 25 },
  { 
    date: "2025-02-29",
    dayOfWeek: "금",
    success: 69,
    material: "유리",
    count: 40,
    summary: "69%",
    chartData: [
      { name: "플라스틱", count: 30, success: 70 },
      { name: "종이", count: 20, success: 60 },
      { name: "유리", count: 35, success: 80 },
      { name: "캔", count: 25, success: 65 }
    ]
  }
]

// 📆 주차 계산 함수
const getWeekNumber = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 1)
  const diff = date.getTime() - start.getTime()
  const dayDiff = diff / (1000 * 60 * 60 * 24)
  return Math.ceil((dayDiff + start.getDay() + 1) / 7)
}

// 🎨 재질별 색상 헬퍼
const getColor = (material: string) => {
  const colors: { [key: string]: string } = {
    "플라스틱": "#3498db",
    "종이": "#2ecc71",
    "유리": "#e67e22",
    "캔": "#e74c3c"
  }
  return colors[material] || "#7f8c8d"
}

export default function RecyclingStats() {
  const [current, setCurrent] = useState(0)

  const nextCard = () => setCurrent((prev) => (prev + 1) % cardData.length)
  const prevCard = () => setCurrent((prev) => (prev - 1 + cardData.length) % cardData.length)
  const getIndex = (index: number) => (index + cardData.length) % cardData.length

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-[500px] max-h-[500px] p-6 relative overflow-visible scale-90">

      {/* 제목 */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800">♻️ 분리배출 기록</h1>
       
      {/* 좌우 버튼 */}
      <Button 
        onClick={prevCard} 
        className="absolute left-[calc(40%-480px)] top-1/2 transform -translate-x-full -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-black transition">
        ←
      </Button>
      <Button 
        onClick={nextCard} 
        className="absolute right-[calc(40%-480px)] top-1/2 transform translate-x-full -translate-y-1/2 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-black transition">
        →
      </Button>

      {/* 카드 섹션 */}
      <div className="relative w-[1000px] h-auto top-1/2 flex items-center justify-center overflow-hidden p-8 bg-white rounded-lg shadow-lg border border-green-300">
        <AnimatePresence mode="wait">
          {/* 왼쪽 미리보기 */}
          <motion.div
            key={`prev-${getIndex(current - 1)}`}
            initial={{ scale: 0.8, x: "-100%" }}
            animate={{ scale: 0.9, x: "-80%" }}
            exit={{ scale: 0.8, x: "-150%" }}
            transition={{ duration: 0.5 }}
            className="absolute bg-green-50 p-3 rounded-lg shadow-sm border border-green-200 w-[300px] h-[250px] opacity-70"
          >
            <h2 className="text-xl font-semibold text-green-700">
              {cardData[getIndex(current - 1)].dayOfWeek} {getWeekNumber(new Date(cardData[getIndex(current - 1)].date))}주차
            </h2>
          </motion.div>

          {/* 메인 카드 */}
          <motion.div
            key={`current-${current}`}
            initial={{ scale: 0.8, x: 0 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0.8, x: "-100%" }}
            transition={{ duration: 0.6 }}
            className={`z-10 p-8 rounded-lg shadow-md border w-[500px] h-[400px] 
              ${current === 4 ? 'bg-yellow-50 border-yellow-300' : 'bg-white border-green-200'}`}
          >
            <h2 className={`text-2xl font-semibold mb-4 ${current === 4 ? 'text-yellow-900' : 'text-green-900'}`}>
              {cardData[current].dayOfWeek} {getWeekNumber(new Date(cardData[current].date))}주차
              {current === 4 ? ' 📊 월간 리포트' : ' 분리배출 기록'}
            </h2>

            {/* 월간 카드 (Scatter Chart) */}
            {current === 4 ? (
              <div className="bg-yellow-100 p-6 rounded-lg border border-yellow-300 h-[300px]">
                <h3 className="text-xl font-bold text-yellow-900 mb-4">📈 한 달 성과 분석</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="count" name="배출 횟수" unit="회" />
                    <YAxis type="number" dataKey="success" name="성공률" unit="%" />
                    <ZAxis type="number" dataKey="count" range={[100, 500]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="재질 분석" data={cardData[current].chartData} fill="#82ca9d">
                      {cardData[current].chartData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="mt-3 text-sm text-yellow-600">X: 배출 횟수 | Y: 성공률 | 원 크기: 배출 횟수 비례</p>
              </div>
            ) : (
              // 주간 카드
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-2">분리배출 성공률</h3>
                <p className="text-4xl font-bold text-green-600 mb-4">{cardData[current].success}%</p>
                <p className="text-md text-green-700">가장 잘 분리배출한 재질: {cardData[current].material}</p>
                <p className="text-sm text-gray-500">📅 요일: {cardData[current].dayOfWeek}</p>
              </div>
            )}
          </motion.div>

          {/* 오른쪽 미리보기 */}
          <motion.div
            key={`next-${getIndex(current + 1)}`}
            initial={{ scale: 0.8, x: "100%" }}
            animate={{ scale: 0.9, x: "80%" }}
            exit={{ scale: 0.8, x: "150%" }}
            transition={{ duration: 0.5 }}
            className="absolute bg-green-50 p-3 rounded-lg shadow-sm border border-green-200 w-[300px] h-[250px] opacity-70"
          >
            <h2 className="text-xl font-semibold text-green-700">
              {cardData[getIndex(current + 1)].dayOfWeek} {getWeekNumber(new Date(cardData[getIndex(current + 1)].date))}주차
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
