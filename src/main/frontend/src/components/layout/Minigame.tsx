import { useState } from "react";

export default function Sidebar() {
  const [score, setScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const quizQuestions = [
    {
      question: "플라스틱 병을 올바르게 버리려면?",
      options: ["물로 헹군 후 버린다", "라벨을 제거하고 버린다", "뚜껑을 닫아 버린다"],
      answer: "라벨을 제거하고 버린다"
    },
    {
      question: "음식물이 묻은 종이컵은?",
      options: ["종이류로 분리배출", "일반 쓰레기", "세척 후 종이류 배출"],
      answer: "일반 쓰레기"
    },
    {
      question: "탄소발자국을 줄이는 행동은?",
      options: ["일회용 컵 사용", "대중교통 이용", "자동차 혼자 타기"],
      answer: "대중교통 이용"
    },
    {
      question: "전자 폐기물을 올바르게 처리하는 방법은?",
      options: ["일반 쓰레기로 버린다", "전자 폐기물 수거함 이용", "소각장에서 태운다"],
      answer: "전자 폐기물 수거함 이용"
    },
    {
      question: "에너지를 절약하는 방법은?",
      options: ["불필요한 전등 끄기", "창문 열어 냉난방 보완", "전기 제품을 계속 켜두기"],
      answer: "불필요한 전등 끄기"
    },
    {
      question: "친환경 소비 습관은?",
      options: ["플라스틱 포장 제품 구매", "재사용 가능한 제품 사용", "일회용 용기 사용"],
      answer: "재사용 가능한 제품 사용"
    },
    {
      question: "음식물 쓰레기를 줄이는 방법은?",
      options: ["먹을 만큼만 조리", "유통기한 지난 음식 바로 버리기", "냉동보관 없이 보관"],
      answer: "먹을 만큼만 조리"
    },
    {
      question: "물 절약을 위한 습관은?",
      options: ["샤워 시간을 줄이기", "수돗물을 틀어놓고 설거지", "빗물을 그냥 버리기"],
      answer: "샤워 시간을 줄이기"
    },
    {
      question: "대기 오염을 줄이기 위한 실천은?",
      options: ["대중교통 이용", "자동차 공회전 유지", "쓰레기 소각"],
      answer: "대중교통 이용"
    },
    {
      question: "올바른 분리배출 방법은?",
      options: ["재질별로 나눠서 배출", "모든 쓰레기를 한 봉투에 담기", "유리와 플라스틱을 함께 배출"],
      answer: "재질별로 나눠서 배출"
    }
  ];

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option);
    if (option === quizQuestions[quizIndex].answer) {
      setScore((prev) => prev + 10);
      setMessage("✅ 정답입니다! +10점");
    } else {
      setMessage("❌ 틀렸어요! 다시 도전해보세요.");
    }

    setTimeout(() => {
      setMessage("");
      setSelectedAnswer(null);
      setQuizIndex((prev) => (prev + 1) % quizQuestions.length);
    }, 2000);
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-green-900 text-white p-6 space-y-4 rounded-r-lg shadow-lg">
      <h2 className="text-lg font-bold text-center">🌿 친환경 미니게임</h2>

      <div className="bg-green-800 p-4 rounded-lg shadow">
        <h3 className="text-md font-semibold">🌱 환경 퀴즈</h3>
        <p className="text-sm mt-2">{quizQuestions[quizIndex].question}</p>
        <div className="mt-3 space-y-2">
          {quizQuestions[quizIndex].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`block w-full py-2 text-sm rounded-md transition ${
                selectedAnswer === option
                  ? option === quizQuestions[quizIndex].answer
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-green-700 hover:bg-green-600"
              }`}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
        {message && <p className="mt-2 text-sm text-center">{message}</p>}
      </div>

      <div className="bg-green-700 p-4 rounded-lg shadow">
        <h3 className="text-md font-semibold">🌎 나의 친환경 점수</h3>
        <p className="text-lg font-bold text-center mt-2">{score} P</p>
        {score < 50 && <p className="text-sm text-center mt-2 text-yellow-300">📌 50점 미만! 유튜브 영상 시청 권장! 📺</p>}
        {score === 100 && <p className="text-sm text-center mt-2 text-blue-300">🎉 100점 달성! 분리배출로 포인트 쌓으러 가기! ♻️</p>}
      </div>
    </div>
  );
}
