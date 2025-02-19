import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"

// 🎯 백엔드에서 받은 데이터 (예제)
const backendData = {
  recentAnalysis: [
    { material: "plastic", success_percent: 85, analysis_date: "2025-02-18" },
    { material: "PET", success_percent: 90, analysis_date: "2025-02-17" },
    { material: "plastic", success_percent: 40, analysis_date: "2025-02-16" },
    { material: "can", success_percent: 65, analysis_date: "2025-02-15" },
    { material: "glass", success_percent: 78, analysis_date: "2025-02-14" },
    { material: "PET_transparent", success_percent: 92, analysis_date: "2025-02-13" }
  ],
  apartmentMonthlyAvgSuccess: {
    "202501": 80.0,
    "202412": 78.0,
    "202411": 72.875
  },
  userMonthlyAvgSuccess: {
    "202501": 80.0,
    "202412": 78.0,
    "202411": 72.875
  },
  monthlyMaterialSuccessRates: {
    "202501": [
      { avg_success: 75.0, material: "can" },
      { avg_success: 80.0, material: "glass" },
      { avg_success: 85.0, material: "paper" },
      { avg_success: 70.0, material: "PET" },
      { avg_success: 90.0, material: "plastic" }
    ],
    "202412": [
      { avg_success: 73.0, material: "can" },
      { avg_success: 78.0, material: "glass" },
      { avg_success: 83.0, material: "paper" },
      { avg_success: 68.0, material: "PET" },
      { avg_success: 88.0, material: "plastic" }
    ],
    "202411": [
      { avg_success: 68.0, material: "can" },
      { avg_success: 68.5, material: "glass" },
      { avg_success: 74.0, material: "paper" },
      { avg_success: 65.0, material: "PET" },
      { avg_success: 82.5, material: "plastic" }
    ]
  }
}

// 🎨 색상 헬퍼
const getColor = (material: string) => {  
  const colors: Record<string, string> = {
    "플라스틱": "#3498db",
    "페트": "#2ecc71",
    "유리": "#e67e22",
    "캔": "#e74c3c",
    "종이": "#8B451",
  }
  return colors[material] || "#7f8c8d"
}

// 🎨 레이더 차트 색상 헬퍼 (RadarChart 전용)
const getRadarColor = (material: string, hoveredMaterial: string | null) => {
  const radarColors: Record<string, string> = {
    "기본값": "#3498db",
   "플라스틱": "#B57EDC",
    "페트": "#27AE60",
    "유리": "#D35400",
    "캔": "#C0392B",
    "종이": "#6D4C41"
  }
  return hoveredMaterial === material || hoveredMaterial === null
    ? radarColors[material] || radarColors["기본값"] // ✅ 기본 색상 적용
    : radarColors["기본값"];
}


// 🗓️ 요일별 성공률 (1페이지)
const WeeklyGraphCard = () => {
  const weeklyData = backendData.recentAnalysis.map((item) => ({
    date: item.analysis_date,
    material: translateMaterial(item.material),
    success: item.success_percent
  }))

  const groupedData = weeklyData.reduce<Record<string, Record<string, number>>>((acc, cur) => {
    const { date, material, success } = cur
    if (!acc[date]) acc[date] = {}
    acc[date][material] = success
    return acc
  }, {})

  const chartData = Object.entries(groupedData).map(([date, materials]) => ({
    date,
    ...materials
  }))

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-200 mb-4">
      <h3 className="text-xl font-semibold text-center mb-4">📊 요일별 성공률 </h3>
      <ResponsiveContainer width={700} height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip contentStyle={{ backgroundColor: "#f4f6f7", borderRadius: 10 }} />
          <Legend />
          {["플라스틱", "페트", "유리", "캔", "종이"].map((mat) => (
            <Bar key={mat} dataKey={mat} fill={getColor(mat)} barSize={12} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 📊 재질별 평균 성공률 (2페이지)
const MonthlyGraphCard = () => {
  const [selectedMonth, setSelectedMonth] = useState("202501")
  const [hoveredMaterial, setHoveredMaterial] = useState<string | null>(null)

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value)
  }

  const monthlyData = Object.entries(backendData.monthlyMaterialSuccessRates).reduce(
    (acc, [month, materials]) => {
      acc[month] = materials.map((item) => ({
        material: translateMaterial(item.material),
        averageSuccess: item.avg_success
      }))
      return acc
    },
    {} as Record<string, { material: string; averageSuccess: number }[]>
  )

  const currentData = monthlyData[selectedMonth] || []

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-200 mb-4">
      <div className="flex justify-start mb-4">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="px-4 py-2 border border-gray-400 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105 transition-all"
        >
          {Object.keys(monthlyData).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">📊 {selectedMonth} 평균 성공률</h3>

      <ResponsiveContainer width={700} height={300}>
        <RadarChart data={currentData}>
          <PolarGrid stroke="#bdc3c7" strokeDasharray="6 6" />
          <PolarAngleAxis
            dataKey="material"
            tick={{ fill: "#34495e" }}
            onMouseEnter={(e) => setHoveredMaterial(e.value)}
            onMouseLeave={() => setHoveredMaterial(null)}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name={`${selectedMonth} 평균 성공률`}
            dataKey="averageSuccess"
            stroke={getRadarColor(hoveredMaterial || "기본값", hoveredMaterial)}
            fill={getRadarColor(hoveredMaterial || "기본값", hoveredMaterial)}
            fillOpacity={0.6}
          />
          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: 10, border: "1px solid #ddd" }} />
          <Legend />Opacity={0.6}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 📊 Ranking 그래프 카드 (3페이지)
const RankingGraphCard = () => {
  const rankingData = Object.entries(backendData.apartmentMonthlyAvgSuccess as Record<string, number>).map(([month, avg]) => ({
    date: month,
    주민평균: avg,
    유저평균: backendData.userMonthlyAvgSuccess[month as keyof typeof backendData.userMonthlyAvgSuccess]
  }))
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
      <h3 className="text-xl font-semibold text-center mb-4">📊 월 평균 주민 & 유저 데이터</h3>
      <ResponsiveContainer width={700} height={300}>
        <LineChart data={rankingData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} tickCount={6} />
          <Tooltip /> 
          <Legend />
          <Line type="monotone" dataKey="주민평균" stroke="#2ecc71" strokeWidth={3} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="유저평균" stroke="#3498db" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 🌐 메인 페이지
export default function RecyclingStats() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const nextCard = () => setCurrentCardIndex((prev) => (prev + 1) % 3)
  const prevCard = () => setCurrentCardIndex((prev) => (prev - 1 + 3) % 3)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">♻️ 분리배출 기록</h1>

      <div className="relative w-[1000px] h-[600px] flex items-center justify-center overflow-hidden p-8 bg-white rounded-lg shadow-lg border border-green-300">
        <Button
          onClick={prevCard}
          className="absolute left-[20px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-300 to-blue-400 text-white px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 ease-in-out shadow-lg"
        >
          ←
        </Button>

        <Button
          onClick={nextCard}
          className="absolute right-[20px] top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-300 to-blue-400 text-white px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 ease-in-out shadow-lg"
        >
          →
          </Button>

        <AnimatePresence mode="wait">
          {currentCardIndex === 0 ? (
            <motion.div
              key="weekly-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <WeeklyGraphCard />
            </motion.div>
          ) : currentCardIndex === 1 ? (
            <motion.div
              key="monthly-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <MonthlyGraphCard />
            </motion.div>
          ) : (
            <motion.div
              key="ranking-graph-card"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="absolute"
            >
              <RankingGraphCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// 🔀 재질 이름 변환 함수
function translateMaterial(material: string): string {
  const map: Record<string, string> = {
    plastic: "플라스틱",
    PET: "페트",
    "PET_transparent": "페트",
    can: "캔",
    glass: "유리",
    paper: "종이"
  }
  return map[material] || material
}
