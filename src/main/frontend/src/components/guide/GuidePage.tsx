import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/guide/Modal"
import BackgroundAnimation from "@/components/layout/BackgroudAnimation"
import { motion } from "framer-motion"

export function GuidePage() {
  const navigate = useNavigate()

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const materialImages: Record<string, string> = {
    유리: '/images/glass.png',
    플라스틱: '/images/plastic.png',
    종이: '/images/paper.png',
    비닐: '/images/vinyl.png',
    금속: '/images/metal.png',
    스티로폼: '/images/styrofoam.png',
  }

  const materialIcons: Record<string, string> = {
    유리: '/icons/glass.png',
    플라스틱: '/icons/plastic.png',
    종이: '/icons/paper.png',
    비닐: '/icons/vinyl.png',
    금속: '/icons/metal.png',
    스티로폼: '/icons/styrofoam.png',
  }

  const materials = Object.keys(materialImages)

  const openModal = (material: string) => {
    setSelectedMaterial(material)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedMaterial(null)
  }

  // 기존 다중 이미지 대신 단일 이미지 사용
  // const guideImages = Array.from({ length: 4 }, (_, i) => `/Guide/${i + 1}.png`)
  const guideImages = ["/Guide/guide.jpg"]

  return (
    <div className="relative min-h-screen">
      {/* 🔹 배경 애니메이션 */}
      <BackgroundAnimation />

      {/* 🔹 뒤로 가기 버튼 */}
      <div className="absolute top-[70px] left-64 z-[999]"> 
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-black border border-gray-300 shadow-md hover:bg-gray-300 active:bg-gray-500 px-4 py-2 rounded transition-colors"
        >
          ← 뒤로 가기
        </button>
      </div>

      {/* 🔹 이미지 섹션 */}
      <div className="flex flex-col items-center justify-center relative z-50 pt-16">
        
        {guideImages.map((src, index) => (
          <section
            key={index}
            className="w-full flex justify-center items-center relative"
          >
            {/* 📸 이미지 */}
            <motion.img
              src={src}
              alt={`가이드 이미지 ${index + 1}`}
              className="w-full max-w-5xl h-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                console.error(`이미지 로딩 실패: ${src}`)
                ;(e.target as HTMLImageElement).src = '/images/default.png'
              }}
            />

            {/* 📍 버튼 컨테이너 */}
            {index === 0 && (
              <div className="absolute top-[80%] left-[47%] transform -translate-x-1/2 flex items-center space-x-6">
                
                {/* 🔹 재질별 분리배출 방법 버튼 (나중에 사용) */}
                {/*
                <motion.button
                  onClick={scrollToGuide}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                >
                  재질별 분리배출 방법
                </motion.button>
                */}

                {/* 🔹 기존 스크롤 화살표 버튼 (나중에 사용) */}
                {/*
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-[140%] left-[45%] transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
                  onClick={scrollDown}
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
                */}

                {/* 🔹 3D 모델 버튼 (나중에 사용) */}
                {/*
                <motion.button
                  disabled
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md cursor-not-allowed opacity-60"
                >
                  3D 모델로 분리배출 알아보기
                </motion.button>
                */}
              </div>
            )}
          </section>
        ))}

        {/* 🔹 재질별 분리배출 가이드 섹션 */}
        <section id="guide-section" className="w-full flex justify-center items-center relative">
          <motion.div
            className="w-full max-w-5xl bg-white shadow-xl p-6 rounded-lg z-50"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-center">재질별 분리배출 가이드💡</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {materials.map((material) => (
                <Card
                  key={material}
                  className="p-6 flex flex-col items-center justify-center text-center space-y-4 bg-white shadow-lg hover:scale-105 transition-transform"
                >
                  <img 
                    src={materialIcons[material]} 
                    alt={`${material} 아이콘`} 
                    className="w-12 h-12"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{material}</h3>
                    <Button variant="outline" className="mt-2" onClick={() => openModal(material)}>
                      가이드 보기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      {/* 🔹 모달 컴포넌트 */}
      {isModalOpen && selectedMaterial && (
        <Modal onClose={closeModal} title={`${selectedMaterial} 분리배출 가이드`}>
          <img 
            src={selectedMaterial ? materialImages[selectedMaterial] : '/images/default.png'} 
            alt={`${selectedMaterial ?? '알 수 없음'} 분리배출`} 
            className="w-full h-auto object-cover mb-4 rounded-lg"
          />
          <p className="text-gray-600 mb-4">{selectedMaterial}에 대한 올바른 분리배출 방법을 확인하세요.</p>
        </Modal>
      )}
    </div>
  )
}
