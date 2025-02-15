import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import BackgroundAnimation from '@/components/layout/BackgroudAnimation'

const images = [
  '/Ranking/1.png',
  '/Ranking/2.png',
  '/Ranking/3.png',
  '/Ranking/3.5.2.png',
  '/Ranking/4.jpg',
  '/Ranking/5.jpg',
  '/Ranking/6.jpg',
  '/Ranking/7.jpg',
  '/Ranking/8.jpg'
]

export default function RankTierGuide() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen">
      {/* 🔹 뒤로 가기 버튼 */}
      <div className="absolute top-[75px] left-64 z-[999]"> 
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-black border border-gray-300 shadow-md hover:bg-gray-300 active:bg-gray-500 px-4 py-2 rounded transition-colors"
        >
          ← 뒤로 가기
        </button>
      </div>

      {/* 🔹 백그라운드 애니메이션 */}
      <BackgroundAnimation />

      {/* 🔹 이미지 섹션 */}
      <div className="space-y-12 py-8 relative z-50 pt-16">
        {images.map((src, index) => (
          <section
            key={index}
            id={`section-${index}`}
            className={`w-full flex justify-center items-center relative ${index === 0 ? "mt-14" : ""}`}>

            {/* 🖼️ 이미지 */}
            <motion.img
              src={src}
              alt={`Ranking Image ${index + 1}`}
              className="w-full max-w-5xl h-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.04 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />

            {/* 🔽 아래로 스크롤 버튼 (첫 번째 이미지에만)
            {index === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-[90%] left-[47%] transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
                onClick={() => scrollToSection(1)}
              >
                <p className="text-black text-sm mb-2">아래로 스크롤하세요</p>
                <svg
                  className="w-6 h-6 text-white animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            )} */}
          </section>
        ))}
      </div>
    </div>
  )
}
