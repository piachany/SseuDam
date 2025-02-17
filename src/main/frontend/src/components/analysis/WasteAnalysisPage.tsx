import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BackgroundAnimation from "@/components/layout/BackgroudAnimation";

export default function WasteAnalysisPage() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 🔹 특정 섹션으로 부드럽게 스크롤
  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" });
    setCurrentSection(index);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* 백그라운드 애니메이션 추가 */}
      <BackgroundAnimation />

      {/* ✅ 현재 섹션 표시 UI (왼쪽 상단) */}
      <div className="fixed top-10 left-10 bg-black text-white px-4 py-2 rounded">
        현재 섹션: {currentSection + 1} / 4
      </div>

      <div className="relative z-50 pt-16">
        {/* ✅ 첫 번째 섹션: 메인 타이틀 */}
        <section ref={(el) => (sectionsRef.current[0] = el)} className="min-w-full h-screen flex flex-col items-center justify-center text-center bg-gray-100/50">
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-6xl font-extrabold">
            <span className="text-blue-600">"지구</span>를 위한 한걸음"
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }} className="text-2xl text-green-600 font-semibold mt-2">
            오늘도 리워드!
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
            <Button className="mt-4 px-6 py-3 text-lg bg-blue-600 text-white rounded-full" onClick={() => scrollToSection(1)}>
              시작하기
            </Button>
          </motion.div>
        </section>

        {/* ✅ 두 번째 섹션: 로딩 화면 */}
        <section ref={(el) => (sectionsRef.current[1] = el)} className="min-w-full h-screen flex flex-col items-center justify-center text-center bg-white/50">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-lg mb-4">
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

        {/* ✅ 세 번째 섹션: AI 분석 결과 */}
        <section ref={(el) => (sectionsRef.current[2] = el)} className="min-w-full py-20 flex flex-col items-center justify-center text-center bg-white/50">
          <h2 className="text-4xl font-bold">AI 분석 결과</h2>
          <p className="text-gray-500">재질 및 상태 분류 결과를 확인하세요</p>

          {/* 카드 리스트 */}
          <div className="mt-8 grid grid-cols-3 gap-6 justify-items-center">
            {cardData.map((item, index) => <Card key={index} {...item} />)}
          </div>
        </section>

        {/* ✅ 네 번째 섹션: 올바른 & 잘못된 분리배출 */}
        <section className="min-w-full py-20 bg-gray-50/50">
          <div className="w-[1500px] h-[800px] mx-auto grid grid-cols-2 gap-8 text-center">
            <div className="p-6 bg-white/70 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold">✅ 올바른 분리배출</h3>
              <p className="italic text-gray-500 mt-4">"재활용이 쉬운 상태로 배출되었습니다."</p>
            </div>
            <div className="p-6 bg-white/70 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold">❌ 잘못된 분리배출</h3>
              <p className="italic text-gray-500 mt-4">"이물질이 포함되어 있습니다."</p>
            </div>
          </div>
        </section>

        {/* ✅ 추가 버튼 */}
        <div className="mt-12 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => navigate("/home")}>홈으로 가기</Button>
          <Button variant="default" className="bg-black text-white" onClick={() => navigate("/waste-analysis")}>분석 다시 하기</Button>
        </div>
      </div>
    </div>
  );
}

// 🔹 카드 UI 컴포넌트
interface CardProps {
  material: string;
  status: string;
  tag: string;
}

const cardData: CardProps[] = [
  { material: "플라스틱", status: "깨끗함", tag: "이물질 없음" },
  { material: "종이", status: "일부 오염", tag: "이물질 있음" },
  { material: "캔", status: "깨끗함", tag: "이물질 없음" },
  { material: "유리", status: "깨끗함", tag: "이물질 없음" },
  { material: "비닐", status: "일부 오염", tag: "이물질 있음" },
  { material: "철", status: "깨끗함", tag: "이물질 없음" }
];

const Card = ({ material, status, tag }: CardProps) => (
  <div className="w-72 bg-white/70 shadow-md rounded-lg overflow-hidden">
    <div className="h-40 bg-gray-200/50 flex items-center justify-center">
      <span className="text-sm text-gray-700">{tag}</span>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold">{material}</h3>
      <p className="text-gray-500">{status}</p>
    </div>
  </div>
);
