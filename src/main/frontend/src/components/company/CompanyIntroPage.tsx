import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function CompanyIntroPage() {
  const navigate = useNavigate()
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden relative font-sans text-gray-900">
      {/* 🛠️ 네비게이션 바 */}
      <nav className="fixed top-0 left-0 w-full bg-white text-black flex items-center justify-between px-8 py-4 z-50 border-b border-gray-300 shadow-sm">
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-4 px-4 py-2 rounded-full">
          <button
            onClick={() => scrollToSection(0)}
            className="text-gray-900 font-serif text-2xl tracking-wide hover:text-teal-600 transition-colors duration-300"
          >
            Ssuedam 🌿
          </button>
        </div>
        <div className="flex items-center space-x-4 text-black text-sm font-medium absolute right-8 top-4">
          <button
            onClick={() => navigate("/auth")}
            className="hover:text-teal-600 transition-colors duration-300"
          >
            회원가입
          </button>
          <span className="text-gray-400">|</span>
          <button
            onClick={() => navigate("/auth")}
            className="hover:text-teal-600 transition-colors duration-300"
          >
            로그인
          </button>
        </div>
      </nav>

      {/* 🎬 동영상 섹션 */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="w[-full] h-[650px] relative overflow-hidden mt-30 mx-auto"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover m-auto rounded-2xl"
        >
          <source src="/Intro/movie7.mp4" type="video/mp4" />
          브라우저가 비디오 태그를 지원하지 않습니다.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-serif mb-4"
          >
            AI 기반 스마트 분리배출
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl text-gray-300 mb-8"
          >
            올바르게 버리고, 가치 있게 돌려받자!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <Button
              onClick={() => navigate("/auth")}
              className="px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-400 text-gray-900 rounded-full shadow-lg hover:from-gray-300 hover:to-gray-500 transition-all font-semibold"
            >
               지금 시작하기
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center cursor-pointer"
            onClick={() => scrollToSection(1)}
          >
            <p className="text-white text-sm mb-2">아래로 스크롤하세요</p>
            <svg
              className="w-6 h-6 text-teal-300 animate-bounce"
              onClick={() => scrollToSection(1)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* 🖼️ 브랜드 스토리 섹션 */}
      <section className="relative bg-white py-20 px-12">
        <div className="absolute left-0 top-0 w-4/5 h-full bg-gradient-to-br from-gray-100 to-white rounded-r-full z-0" />
        <h2 className="relative z-10 text-3xl font-serif font-bold mb-6 translate-x-12 translate-y-12">
          "Our Mission: A Cleaner Tomorrow."
        </h2>
        <h2 className="relative z-10 text-2xl font-light mb-6 translate-x-12 translate-y-12">
          지속 가능한 지구를 위한 우리의 이야기.
        </h2>

        <div className="flex">
          {/* 🌱 좌측 세로 텍스트 */}
          <div className="relative w-1/3 flex items-center justify-center">
            <img
              src="/Intro/robot.png"
              alt="브랜드 이미지"
              className="absolute w-[400px] h-[400px] object-cover opacity-20 pointer-events-none"
            />
            <span className="text-5xl text-gray-800 font-extrabold transform -rotate-90">
              Ssuedam
            </span>
          </div>

          {/* 📷 우측 2x2 이미지와 텍스트 */}
          <div className="grid grid-cols-2 gap-4 relative z-12 w-3/4 transform pl-40">
            {[
              { src: "/Intro/intro11.jpg", title: "AI와 함께하는 올바른 분리수거", desc: "버릴 때마다 배우는 올바른 습관" },
              { src: "/Intro/intro12.jpg", title: "분리배출, 이제 손 안에서 스마트하게", desc: "AI 분석 데이터 실시간 확인 가능" },
              { src: "/Intro/intro10.jpg", title: "정확한 분리수거 AI가 도와줍니다", desc: "올바른 분리수거 시 초록불로 즉시 확인" },
              { src: "/Intro/intro13.jpg", title: "재활용의 가치를, 가이드로 쉽고 즐겁게", desc: "친환경 가이드와 함께하는 분리배출" }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center mt-2 ml-6">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-[290px] h-[380px] object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌐 마지막 페이지 (푸터) */}
    
<footer className="bg-gradient-to-br from-black via-gray-700 to-gray-900 text-white py-16">
  <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-6 h-64">
    
    {/* 🌿 브랜드 로고 */}
    <div className="text-5xl font-serif tracking-wide hover:text-teal-400 transition duration-300">
      Ssuedam 🌿
    </div>

    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1, duration: 1 }}
>
  <Button
    onClick={() => navigate("/auth")}
    className="px-6 py-3 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white rounded-full shadow-lg hover:scale-105 hover:from-gray-600 hover:to-black transition-all font-semibold"
  >
     지금 시작하기
  </Button>
</motion.div>


    {/* 📧 연락처 */}
    <p className="text-sm text-gray-400 mt-4">📧 ssuedam.team@gmail.com</p>

    {/* 🛠️ GitHub 링크 */}
    <a 
      href="https://github.com/your-github-repo" 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-gray-400 hover:text-white transition mt-4"
    >
      {/* GitHub 아이콘 */}
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path 
          fillRule="evenodd" 
          d="M12 2C6.477 2 2 6.477 2 12a10 10 0 006.839 9.489c.5.09.681-.217.681-.481v-1.696c-2.781.604-3.369-1.342-3.369-1.342-.455-1.155-1.109-1.463-1.109-1.463-.907-.62.068-.608.068-.608 1.004.07 1.532 1.03 1.532 1.03.891 1.529 2.339 1.087 2.907.831.09-.646.35-1.086.635-1.337-2.22-.252-4.555-1.111-4.555-4.945 0-1.092.39-1.986 1.029-2.683-.103-.253-.447-1.272.098-2.648 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.838c.85.004 1.705.114 2.5.336 1.91-1.295 2.75-1.026 2.75-1.026.546 1.376.202 2.395.099 2.648.64.697 1.028 1.591 1.028 2.683 0 3.841-2.339 4.689-4.567 4.935.36.309.678.918.678 1.851v2.746c0 .267.18.574.688.475A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" 
          clipRule="evenodd"
        />
      </svg>
      <span className="font-sans">GitHub 저장소</span>
    </a>

    {/* ⚖️ 카피라이트 */}
    <p className="text-xs text-gray-500 mt-6">© 2025 Ssuedam. All rights reserved.</p>
  </div>
</footer>

    </div>
  )
}
