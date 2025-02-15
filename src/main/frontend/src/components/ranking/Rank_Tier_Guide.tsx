import { motion } from 'framer-motion'
import BackgroundAnimation from '@/components/layout/BackgroudAnimation'

const images = [
  '/Ranking/1.png',
  '/Ranking/2.jpg',
  '/Ranking/3.jpg',
  '/Ranking/3.5.2.jpg',
  '/Ranking/4.jpg',
  '/Ranking/5.jpg',
  '/Ranking/6.jpg',
  '/Ranking/7.jpg',
  '/Ranking/8.jpg'
]

export default function RankTierGuide() {
  const scrollToSection = (index: number) => { // index에 number 타입 지정
    const nextSection = document.getElementById(`section-${index}`)
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* 백그라운드 애니메이션 추가 */}
      <BackgroundAnimation />

      <div className="space-y-12 py-8 relative z-50 pt-16">
        {images.map((src, index: number) => ( // index에 명시적으로 number 타입 지정
          <section
            key={index}
            id={`section-${index}`}
            className="w-full flex justify-center items-center relative"
          >
            <motion.img
              src={src}
              alt={`Ranking Image ${index + 1}`}
              className="w-full max-w-5xl h-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.04 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />

            {/* 첫 번째 이미지와 다음 경계에만 표시 */}
            {index === 0 && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: [0, 10, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="absolute top-[90%] left-[47%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
    style={{ transform: 'translateX(-50%) translateY(0)' }} // X축 중앙 강제 적용
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
)}

          </section>
        ))}
      </div>
    </div>
  )
}
