import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import BackgroundAnimation from "@/components/layout/BackgroudAnimation"

// Define section ref type
type SectionRefs = Array<HTMLDivElement | null>;

// 🌟 WasteAnalysisPage Component
export default function WasteAnalysisPage() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const sectionsRef = useRef<SectionRefs>([])

  // 🔹 특정 섹션으로 부드럽게 스크롤
  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
    setCurrentSection(index)
  }

  // 🔄 첫 번째 섹션 단어 애니메이션
  const [wordIndex, setWordIndex] = useState(0)
  const words = ["Start", "Play", "Go!", "Begin", "Recycle"]

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* 🎨 백그라운드 애니메이션 */}
      <BackgroundAnimation />

      {/* ✅ 현재 섹션 표시 UI (왼쪽 상단) */}
      <div className="fixed top-10 left-10 bg-black text-white px-4 py-2 rounded">
        현재 섹션: {currentSection + 1} / 4
      </div>

      <div className="relative z-50 pt-16">
        
        {/* ✅ 1️⃣ 첫 번째 섹션: 애니메이션 타이틀 */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current[0] = el
          }}
          className="min-w-full h-screen flex flex-col items-center justify-center text-center bg-white/50 relative"
        >
          {/* 🌏 배경 애니메이션 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-30 z-0"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src="/Intro/robot.png" alt="지구 배경" className="w-1/5" />
          </motion.div>

          {/* 🌿 메인 메시지 */}
          <motion.h1
            className="relative text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-xl z-10"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            🌏 지구를 위한 한 걸음 🌏
          </motion.h1>

          {/* 🔤 동적 단어 애니메이션 */}
          <motion.h2
            className="relative text-3xl font-bold text-teal-700 mb-10 z-10"
            key={wordIndex}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            "{words[wordIndex]} with Us! "
          </motion.h2>

          {/* 🚀 CTA 버튼 */}
          <motion.button
            className="relative z-10 px-6 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-full shadow-xl 
                       hover:scale-110 hover:shadow-2xl hover:bg-gradient-to-l transition-all duration-500 active:scale-95"
            whileTap={{ scale: 0.85, rotate: 5 }}
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px #1E90FF" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => scrollToSection(1)}
          >
             시작하기
          </motion.button>

          {/* 🌟 반짝이는 별 애니메이션 */}
          <div className="absolute top-10 left-20 animate-ping text-yellow-300 text-2xl">✨</div>
          <div className="absolute bottom-20 right-32 animate-pulse text-pink-300 text-2xl">💫</div>
          <div className="absolute top-40 right-10 animate-bounce text-blue-300 text-3xl">🌟</div>
        </section>

        {/* ✅ 2️⃣ 두 번째 섹션: 로딩 화면 */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current[1] = el
          }}
          className="min-w-full h-screen flex flex-col items-center justify-center text-center bg-white/50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-lg mb-4"
          >
            로딩 중...
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: 20 }} transition={{ delay: 3, duration: 1 }}>
            <Button variant="outline" onClick={() => scrollToSection(2)}>
              분석 결과 보기
            </Button>
          </motion.div>
        </section>

        {/* ✅ 3️⃣ 세 번째 섹션: AI 분석 결과 */}
        <section
          ref={(el) => {
            if (el) sectionsRef.current[2] = el
          }}
          className="min-w-full py-20 flex flex-col items-center justify-center text-center bg-white/50"
        >
          <h2 className="text-4xl font-bold">AI 분석 결과</h2>
          <p className="text-gray-500">재질 및 상태 분류 결과를 확인하세요</p>

          {/* 📊 카드 리스트 */}
          <div className="mt-8 grid grid-cols-3 gap-6 justify-items-center">
            {cardData.map((item, index) => <Card key={index} {...item} />)}
          </div>
        </section>

        {/* ✅ 4️⃣ 네 번째 섹션: 올바른 & 잘못된 분리배출 */}
        <section className="min-w-full py-20 bg-gray-50/50">
          <div className="w-[1500px] h-[800px] mx-auto grid grid-cols-2 gap-8 text-center">
            {/* 🟢 올바른 분리배출 */}
            <div className="p-6 bg-white/70 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                ✅ 올바른 분리배출
              </h3>
              <img src="/images/correct.png" alt="올바른 분리배출" className="w-16 h-16 rounded-full mx-auto mt-4" />
              <p className="italic text-gray-500 mt-4">"재활용이 쉬운 상태로 배출되었습니다."</p>
              <div className="mt-4 bg-gray-300 w-full h-40 flex items-center justify-center text-gray-500 text-sm">
                올바른 분리배출 사례
              </div>
              <p className="mt-2 text-gray-600">이것은 올바른 분리배출 사례 제목입니다.</p>
              <a href="#" className="text-blue-500 mt-2 block">READ MORE</a>
            </div>

            {/* 🔴 잘못된 분리배출 */}
            <div className="p-6 bg-white/70 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                ❌ 잘못된 분리배출
              </h3>
              <img src="/images/incorrect.png" alt="잘못된 분리배출" className="w-16 h-16 rounded-full mx-auto mt-4" />
              <p className="italic text-gray-500 mt-4">"이물질이 포함되어 있습니다."</p>
              <div className="mt-4 bg-gray-300 w-full h-40 flex items-center justify-center text-gray-500 text-sm">
                잘못된 분리배출 사례
              </div>
              <p className="mt-2 text-gray-600">이것은 잘못된 분리배출 사례 제목입니다.</p>
              <a href="#" className="text-blue-500 mt-2 block">READ MORE</a>
            </div>
          </div>
        </section>

        {/* 🔹 추가 버튼 */}
        <div className="mt-12 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate("/home")}>홈으로 가기</Button>
          <Button variant="default" className="bg-black text-white" onClick={() => navigate("/waste-analysis")}>분석 다시 하기</Button>
        </div>
      </div>
    </div>
  )
}

// 🌟 카드 UI 컴포넌트
interface CardProps {
  material: string
  status: string
  img: string
}

const cardData: CardProps[] = [
  { material: "플라스틱", status: "깨끗함", img: "Intro/plastic1.png" },
  { material: "종이", status: "일부 오염", img: "Intro/paper1.png" },
  { material: "캔", status: "깨끗함", img: "Intro/can1.png" },
  { material: "유리", status: "깨끗함", img: "Intro/glass1.png" },
  { material: "비닐", status: "일부 오염", img: "Intro/vinyl1.png" },
  { material: "철", status: "깨끗함", img: "Intro/metal1.png" }
]

const Card = ({ material, status, img }: CardProps) => (
  <div className="w-72 bg-white/70 shadow-md rounded-lg overflow-hidden hover:scale-105 transition-transform">
    <div className="h-40 bg-gray-200/50 flex items-center justify-center">
      <img src={img} alt={material} className="w-10 h-10 object-contain" />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold">{material}</h3>
      <p className="text-gray-500">{status}</p>
    </div>
  </div>
)