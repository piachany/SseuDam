import { useState } from "react"
import { motion } from "framer-motion"

export default function Sidebar() {
  const [score, setScore] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const quizQuestions = [
    { 
      question: "플라스틱 병을 올바르게 버리려면?", 
      options: ["물로 헹군 후 버린다", "라벨을 제거하고 버린다", "뚜껑을 닫아 버린다"], 
      answer: "라벨을 제거하고 버린다" 
    },
    { question: "음식물이 묻은 종이컵은?", 
      options: ["종이류로 분리배출", "일반 쓰레기", "세척 후 종이류 배출"], 
      answer: "일반 쓰레기" 
    }
     ]

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option)
    if (option === quizQuestions[quizIndex].answer) {
      setScore((prev) => prev + 10)
      setMessage("✅ 정답입니다! +10점")
    } else {
      setMessage("❌ 틀렸어요! 다시 도전해보세요.")
    }

    setTimeout(() => {
      setMessage("")
      setSelectedAnswer(null)
      setQuizIndex((prev) => (prev + 1) % quizQuestions.length)
    }, 2000)
  }

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="hidden md:flex flex-col w-64 bg-[#43A047] text-white p-6 space-y-4 rounded-r-lg shadow-lg"
    >
      {/* 제목 */}
      <h2 className="text-2xl font-bold text-center whitespace-nowrap">🌿 친환경 미니게임</h2>

      {/* 환경 퀴즈 섹션 */}
      <div className="bg-green-700 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold">🌱 환경 퀴즈</h3>
        <p className="text-sm mt-2">{quizQuestions[quizIndex].question}</p>

        <div className="mt-3 space-y-2">
          {quizQuestions[quizIndex].options.map((option) => (
            <motion.button
              key={option}
              onClick={() => handleAnswer(option)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className={`block w-full py-2 text-sm rounded-md transition ${
                selectedAnswer === option
                  ? option === quizQuestions[quizIndex].answer
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-[#388E3C] hover:bg-green-600"
              }`}
              disabled={selectedAnswer !== null}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {message && (
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="mt-2 text-sm text-center"
          >
            {message}
          </motion.p>
        )}
      </div>

      {/* 친환경 점수 섹션 */}
      <div className="bg-green-700 p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold flex items-center justify-center gap-2 whitespace-nowrap">🌎 나의 친환경 점수</h3>
        
        <motion.p
          key={score} 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3 }}
          className="text-xl font-bold text-center mt-2"
        >
          {score} P
        </motion.p>

        {score < 50 && <p className="text-sm text-center mt-2 text-yellow-300">📌 50점 미만! 유튜브 영상 시청 권장! </p>}
        {score === 100 && <p className="text-sm text-center mt-2 text-blue-300">🎉 100점 달성! 분리배출로 포인트 쌓으러 가기! ♻️</p>}
      </div>
    </motion.div>
  )
}
