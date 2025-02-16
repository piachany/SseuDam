// src/main/frontend/src/components/ranking/Ranking.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCrown, FaUser } from "react-icons/fa";
import BackgroundAnimation from "@/components/layout/BackgroudAnimation";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Dropdown from "react-bootstrap/Dropdown";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import TooltipComponent from "react-bootstrap/Tooltip";
// axiosInstance는 미사용
// import axiosInstance from "@/api/axiosInstance";

// ----------------------
// 1. 등급 계산 함수 
// ----------------------
const calculateGrade = (accumulatedPoints: number): string => {
  if (accumulatedPoints >= 10001) return "🌟에코 히어로";
  if (accumulatedPoints >= 6001) return "🌍지구 지키미";
  if (accumulatedPoints >= 3001) return "🌿지구 친구";
  if (accumulatedPoints >= 1001) return "🗑 분리배출 견습생";
  return "💀환경 테러범";
};

// ----------------------
// 2. API 응답 타입 정의 
// ----------------------
interface RankingUser {
  ranking: number;
  monthlyPoints: number;
  nickname: string;
  uid: string;
  accumulatedPoints: number;
  month: number;
  apartmentId: number;
}

interface MonthPoints {
  month: number;
  totalPoints: number;
}

interface RankingResponse {
  aboveUser: RankingUser | null;
  top3Users: RankingUser[]; // 순서 1→ 2 → 3
  belowUser: RankingUser | null;
  selectedApartmentRankings: RankingUser[] | null;
  monthlyPoints: MonthPoints[];
  user: RankingUser;
  userApartmentRankings: RankingUser[];
}

// ----------------------
// 3. 애니메이션 및 오버레이 스타일
// ----------------------
const AnimationStyles = () => (
  <style>{`
    @keyframes bounceIn {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
      }
    }
    .animate-bounceIn {
      animation: bounceIn 1s ease-out forwards;
    }
    .rotate-3d-container {
      perspective: 1000px;
    }
    .rotate-3d {
      transition: transform 1s;
      transform-style: preserve-3d;
    }
    .group:hover .rotate-3d {
      transform: rotateY(360deg);
    }
    @keyframes sparkleSequence {
      0%, 20% {
        background-position: 0% 0%;
        opacity: 1;
      }
      20.00001%, 25% {
        opacity: 0;
      }
      25.00001%, 45% {
        background-position: 75% 0%;
        opacity: 1;
      }
      45.00001%, 50% {
        opacity: 0;
      }
      50.00001%, 70% {
        background-position: 0% 100%;
        opacity: 1;
      }
      70.00001%, 75% {
        opacity: 0;
      }
      75.00001%, 95% {
        background-position: 100% 100%;
        opacity: 1;
      }
      95.00001%, 100% {
        opacity: 0;
      }
    }
    .sparkle-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('/Ranking/sparkle.png') 0 0 no-repeat;
      background-size: 200% 200%;
      animation: sparkleSequence 6s infinite;
      pointer-events: none;
      z-index: 30;
    }
  `}</style>
);

// ----------------------
// 4. UI 컴포넌트: 사용자 카드 (grade 계산 적용)
// ----------------------
const UserCard = ({
  nickname,
  monthlyPoints,
  accumulatedPoints,
  rank,
  rankDifference,
  highlight = false,
  isFirst = false,
  isLast = false
}: {
  nickname: string;
  monthlyPoints: number;
  accumulatedPoints: number;
  rank: string;
  rankDifference: string;
  highlight?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  const grade = calculateGrade(accumulatedPoints);
  const borderClasses = `
    ${isFirst ? 'rounded-t-lg border-t border-l border-r' : ''}
    ${isLast ? 'rounded-b-lg border-b border-l border-r' : ''}
    ${!isFirst && !isLast ? 'border-l border-r' : ''}
    ${highlight ? 'bg-green-100' : 'bg-white'}
  `;
  return (
    <div className={`p-4 flex flex-col justify-center flex-1 ${borderClasses}`}>
      <div className="flex items-center relative h-40">
        <div className="w-24 h-24 border-4 border-black rounded-full flex items-center justify-center mr-4 relative">
          <FaUser size={40} className="text-black" />
          {highlight && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5 rounded-t-md">
              my
            </div>
          )}
        </div>
        <div className="flex-grow relative pr-20">
          <h2 className="text-xl font-bold">{nickname}</h2>
          <p className="text-gray-600">{grade}</p>
          <div className="w-[130%] bg-gray-200 h-4 rounded mt-2 mb-1 relative">
            <div className="bg-green-400 h-4 rounded" style={{ width: `${(monthlyPoints / 10000) * 100}%` }}></div>
            <div className="absolute top-0 right-0 h-full border-l-4 border-black"></div>
          </div>
          <p className="text-gray-600 text-sm whitespace-nowrap">
            이번달 Eco XP🌱: {monthlyPoints} / 10000
          </p>
          <p className="text-gray-600 text-sm">총 Eco XP🌳: {accumulatedPoints}</p>
        </div>
        <div className="flex flex-col justify-center items-center text-4xl font-bold text-black pl-4 w-44">
          {rank}
          <p className="text-green-600 text-sm mt-1 text-center">{rankDifference}</p>
        </div>
      </div>
    </div>
  );
};

// ----------------------
// 5. UI 컴포넌트: EcoProgressBar (grade 계산 적용)
// ----------------------
const EcoProgressBar = ({ totalXP, monthlyPoints }: { totalXP: number; monthlyPoints: number }) => {
  const grade = calculateGrade(totalXP);
  const levelUpPoints = 10000;
  const progressPercentage = (monthlyPoints / levelUpPoints) * 100;
  const remainingPoints = levelUpPoints - monthlyPoints;
  return (
    <Card className="p-6 bg-white rounded-lg shadow-md relative w-full">
      <h2 className="text-xl font-bold mb-2">
        나의 등급: <span className="font-normal">{grade}</span>
      </h2>
      <br />
      <div className="mt-4 relative w-full h-6 bg-gray-300 rounded-full overflow-visible">
        <div className="h-full bg-green-500 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        <div
          className="absolute -top-8 z-20"
          style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
        >
          <div className="bg-black text-white text-xs px-3 py-1 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
            🌱 {remainingPoints} Eco XP 남음!
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="text-left">
          <p className="text-sm text-gray-600">누적 Eco XP</p>
          <p className="text-lg font-bold text-green-600">{totalXP} XP</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">다음 등급 XP</p>
          <p className="text-lg font-bold text-gray-600">{levelUpPoints} XP</p>
        </div>
      </div>
    </Card>
  );
};

// ----------------------
// 6. 더미데이터 정의
// 공주아파트 더미 데이터
const dummyRankingDataGongju: RankingResponse = {
  aboveUser: {
    ranking: 2,
    monthlyPoints: 1400,
    nickname: "햇살둥이",
    uid: "dummy-1-2",
    accumulatedPoints: 8000,
    month: 202301,
    apartmentId: 1,
  },
  top3Users: [
    {
      ranking: 1,
      monthlyPoints: 1500,
      nickname: "초록콩",
      uid: "dummy-1-1",
      accumulatedPoints: 12000,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 2,
      monthlyPoints: 1400,
      nickname: "햇살둥이",
      uid: "dummy-1-2",
      accumulatedPoints: 8000,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 3,
      monthlyPoints: 1200,
      nickname: "김제니",
      uid: "dummy-1-3",
      accumulatedPoints: 2300,
      month: 202301,
      apartmentId: 1,
    },
  ],
  belowUser: {
    ranking: 4,
    monthlyPoints: 900,
    nickname: "지구사랑",
    uid: "dummy-1-4",
    accumulatedPoints: 7000,
    month: 202301,
    apartmentId: 1,
  },
  selectedApartmentRankings: null,
  monthlyPoints: [],
  user: {
    ranking: 3,
    monthlyPoints: 1200,
    nickname: "김제니",
    uid: "dummy-1-3",
    accumulatedPoints: 2300,
    month: 202301,
    apartmentId: 1,
  },
  userApartmentRankings: [
    {
      ranking: 1,
      monthlyPoints: 1500,
      nickname: "초록콩",
      uid: "dummy-1-1",
      accumulatedPoints: 12000,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 2,
      monthlyPoints: 1400,
      nickname: "햇살둥이",
      uid: "dummy-1-2",
      accumulatedPoints: 8000,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 3,
      monthlyPoints: 1200,
      nickname: "김제니",
      uid: "dummy-1-3",
      accumulatedPoints: 2300,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 4,
      monthlyPoints: 900,
      nickname: "지구사랑",
      uid: "dummy-1-4",
      accumulatedPoints: 7000,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 5,
      monthlyPoints: 850,
      nickname: "작은숲",
      uid: "dummy-1-5",
      accumulatedPoints: 5100,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 6,
      monthlyPoints: 800,
      nickname: "반짝별",
      uid: "dummy-1-6",
      accumulatedPoints: 4500,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 7,
      monthlyPoints: 750,
      nickname: "푸른바다",
      uid: "dummy-1-7",
      accumulatedPoints: 6600,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 8,
      monthlyPoints: 700,
      nickname: "하늘콩",
      uid: "dummy-1-8",
      accumulatedPoints: 6500,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 9,
      monthlyPoints: 650,
      nickname: "초코칩",
      uid: "dummy-1-9",
      accumulatedPoints: 3200,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 10,
      monthlyPoints: 600,
      nickname: "쓰레기맨",
      uid: "dummy-1-10",
      accumulatedPoints: 950,
      month: 202301,
      apartmentId: 1,
    },
    {
      ranking: 11,
      monthlyPoints: 400,
      nickname: "일쓰봉",
      uid: "dummy-1-11",
      accumulatedPoints: 970,
      month: 202301,
      apartmentId: 1,
    },
  ],
};

// 왕자아파트 더미 데이터
const dummyRankingDataPrince: RankingResponse = {
  aboveUser: {
    ranking: 2,
    monthlyPoints: 1350,
    nickname: "햇살둥이_왕자",
    uid: "dummy-2-2",
    accumulatedPoints: 8500,
    month: 202301,
    apartmentId: 2,
  },
  top3Users: [
    {
      ranking: 1,
      monthlyPoints: 1600,
      nickname: "펭귄대장",
      uid: "dummy-2-1",
      accumulatedPoints: 12500,
      month: 202301,
      apartmentId: 2,
    },
    {
      ranking: 2,
      monthlyPoints: 1350,
      nickname: "햇살둥이_왕자",
      uid: "dummy-2-2",
      accumulatedPoints: 8500,
      month: 202301,
      apartmentId: 2,
    },
    {
      ranking: 3,
      monthlyPoints: 1100,
      nickname: "분리짱짱_왕자",
      uid: "dummy-2-3",
      accumulatedPoints: 3100,
      month: 202301,
      apartmentId: 2,
    },
  ],
  belowUser: {
    ranking: 4,
    monthlyPoints: 950,
    nickname: "지구뿌셔_왕자",
    uid: "dummy-2-4",
    accumulatedPoints: 7100,
    month: 202301,
    apartmentId: 2,
  },
  selectedApartmentRankings: null,
  monthlyPoints: [],
  user: {
    ranking: 3,
    monthlyPoints: 1100,
    nickname: "분리짱짱_왕자",
    uid: "dummy-2-3",
    accumulatedPoints: 3100,
    month: 202301,
    apartmentId: 2,
  },
  userApartmentRankings: [
    {
      ranking: 1,
      monthlyPoints: 1600,
      nickname: "펭귄대장",
      uid: "dummy-2-1",
      accumulatedPoints: 12500,
      month: 202301,
      apartmentId: 2,
    },
    {
      ranking: 2,
      monthlyPoints: 1350,
      nickname: "햇살둥이_왕자",
      uid: "dummy-2-2",
      accumulatedPoints: 8500,
      month: 202301,
      apartmentId: 2,
    },
    {
      ranking: 3,
      monthlyPoints: 1100,
      nickname: "분리짱짱_왕자",
      uid: "dummy-2-3",
      accumulatedPoints: 3100,
      month: 202301,
      apartmentId: 2,
    },
    {
      ranking: 4,
      monthlyPoints: 950,
      nickname: "지구뿌셔_왕자",
      uid: "dummy-2-4",
      accumulatedPoints: 7100,
      month: 202301,
      apartmentId: 2,
    },
  ],
};

// 종합랭킹 (공주 + 왕자 데이터를 단순히 합친 예시)
const dummyRankingDataCombined: RankingResponse = {
  aboveUser: null,
  top3Users: [
    dummyRankingDataGongju.top3Users[0],
    dummyRankingDataPrince.top3Users[0],
    dummyRankingDataGongju.top3Users[1],
  ],
  belowUser: null,
  selectedApartmentRankings: null,
  monthlyPoints: [],
  user: dummyRankingDataGongju.user,
  userApartmentRankings: [
    ...dummyRankingDataGongju.userApartmentRankings,
    ...dummyRankingDataPrince.userApartmentRankings,
  ],
};

// ----------------------
// 7. 메인 Ranking 컴포넌트
// ----------------------
export function Ranking() {
  const [rankingData, setRankingData] = useState<RankingResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApartment, setSelectedApartment] = useState("공주아파트");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedApartment === "공주아파트") {
      setRankingData(dummyRankingDataGongju);
    } else if (selectedApartment === "왕자아파트") {
      setRankingData(dummyRankingDataPrince);
    } else {
      setRankingData(dummyRankingDataCombined);
    }
    setCurrentPage(1);
  }, [selectedApartment]);

  if (!rankingData) {
    return (
      <div className="relative min-h-screen">
        <BackgroundAnimation />
        <div className="relative z-50 flex justify-center items-center min-h-screen">
          <p className="text-gray-500 animate-pulse">랭킹 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  const { top3Users } = rankingData;
  const silverUser = top3Users[1];
  const goldUser = top3Users[0];
  const bronzeUser = top3Users[2];

  const medalColors = {
    gold: { bg: "bg-yellow-100", crown: "text-yellow-400" },
    silver: { bg: "bg-gray-200", crown: "text-gray-400" },
    bronze: { bg: "bg-orange-100", crown: "text-orange-400" },
  };

  const userCards: (RankingUser & { position: 'above' | 'current' | 'below' })[] = [];
  if (rankingData.user) {
    if (rankingData.aboveUser) {
      userCards.push({ ...rankingData.aboveUser, position: 'above' });
    }
    userCards.push({ ...rankingData.user, position: 'current' });
    if (rankingData.belowUser) {
      userCards.push({ ...rankingData.belowUser, position: 'below' });
    }
  }

  const rankingBoardData =
    selectedApartment === "공주아파트" || selectedApartment === "왕자아파트"
      ? rankingData.userApartmentRankings
      : rankingData.selectedApartmentRankings || [];

  const usersPerPage = 10;
  const paginatedUsers = rankingBoardData.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(rankingBoardData.length / usersPerPage))
      setCurrentPage(currentPage + 1);
  };

  return (
    <div className="relative min-h-screen">
      <AnimationStyles />
      <BackgroundAnimation />
      <div className="container mx-auto p-6 relative z-50 pt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🏅대림 1동 분리수거 랭킹
            <OverlayTrigger
              placement="top"
              overlay={
                <TooltipComponent id="tooltip-top">
                  등급 & 랭킹 알아보기!
                </TooltipComponent>
              }
            >
              <button
                type="button"
                className="btn btn-link p-0 ml-2 text-primary"
                onClick={() => navigate("/ranking/rank_tier_guide")}
              >
                <i className="bi bi-question-circle-fill fs-2"></i>
              </button>
            </OverlayTrigger>
          </h1>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" style={{ minWidth: "150px" }}>
              {selectedApartment}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedApartment("공주아파트")}>공주아파트</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedApartment("왕자아파트")}>왕자아파트</Dropdown.Item>
              <Dropdown.Item onClick={() => setSelectedApartment("종합랭킹")}>종합랭킹</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="w-full">
          <div className="hidden md:flex justify-center items-end relative">
            {silverUser && (
              <div className="flex flex-col items-center mx-4" style={{ marginBottom: "2rem" }}>
                <div className="relative flex flex-col items-center group rotate-3d-container">
                  <img src="/Ranking/medal.png" alt="Medal Ribbon" className="w-16" />
                  <div className="mt-[-8px] rotate-3d transition-transform duration-2000 relative w-64 h-64">
                    <div className={`${medalColors.silver.bg} w-full h-full rounded-full shadow-md relative animate-bounceIn`}>
                      <div className="sparkle-overlay"></div>
                      <div className="relative z-20 flex flex-col items-center justify-center p-4">
                        <FaCrown className={`mb-2 text-3xl ${medalColors.silver.crown}`} />
                        <h2 className="text-xl font-bold">{silverUser.nickname}</h2>
                        <p className="text-sm">{calculateGrade(silverUser.accumulatedPoints)}</p>
                        <p className="text-xs">이번달 Eco XP: {silverUser.monthlyPoints}</p>
                        <p className="text-xs">총 Eco XP: {silverUser.accumulatedPoints}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 font-bold text-lg">{silverUser.ranking}위</div>
              </div>
            )}
            {goldUser && (
              <div className="flex flex-col items-center mx-4">
                <div className="relative flex flex-col items-center group rotate-3d-container">
                  <img src="/Ranking/medal.png" alt="Medal Ribbon" className="w-20" />
                  <div className="mt-[-10px] rotate-3d transition-transform duration-2000 relative w-80 h-80">
                    <div className={`${medalColors.gold.bg} w-full h-full rounded-full shadow-lg relative animate-bounceIn`}>
                      <div className="sparkle-overlay"></div>
                      <div className="relative z-20 flex flex-col items-center justify-center p-6">
                        <FaCrown className={`mb-2 text-4xl ${medalColors.gold.crown}`} />
                        <h2 className="text-2xl font-bold">{goldUser.nickname}</h2>
                        <p className="text-lg">{calculateGrade(goldUser.accumulatedPoints)}</p>
                        <p className="text-md">이번달 Eco XP: {goldUser.monthlyPoints}</p>
                        <p className="text-md">총 Eco XP: {goldUser.accumulatedPoints}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 font-bold text-xl">{goldUser.ranking}위</div>
              </div>
            )}
            {bronzeUser && (
              <div className="flex flex-col items-center mx-4" style={{ marginBottom: "2rem" }}>
                <div className="relative flex flex-col items-center group rotate-3d-container">
                  <img src="/Ranking/medal.png" alt="Medal Ribbon" className="w-16" />
                  <div className="mt-[-8px] rotate-3d transition-transform duration-2000 relative w-64 h-64">
                    <div className={`${medalColors.bronze.bg} w-full h-full rounded-full shadow-md relative animate-bounceIn`}>
                      <div className="sparkle-overlay"></div>
                      <div className="relative z-20 flex flex-col items-center justify-center p-4">
                        <FaCrown className={`mb-2 text-3xl ${medalColors.bronze.crown}`} />
                        <h2 className="text-xl font-bold">{bronzeUser.nickname}</h2>
                        <p className="text-sm">{calculateGrade(bronzeUser.accumulatedPoints)}</p>
                        <p className="text-xs">이번달 Eco XP: {bronzeUser.monthlyPoints}</p>
                        <p className="text-xs">총 Eco XP: {bronzeUser.accumulatedPoints}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-2 font-bold text-lg">{bronzeUser.ranking}위</div>
              </div>
            )}
          </div>
          <div className="grid md:hidden grid-cols-1 gap-4 justify-items-center">
            {[silverUser, goldUser, bronzeUser].map((user, index) => {
              if (!user) return null;
              let ribbonSize = index === 1 ? "w-20" : "w-16";
              let medal;
              if (index === 1) medal = medalColors.gold;
              else if (index === 0) medal = medalColors.silver;
              else medal = medalColors.bronze;
              return (
                <div key={user.uid} className="relative flex flex-col items-center">
                  <img src="/Ranking/medal.png" alt="Medal Ribbon" className={ribbonSize} />
                  <div className="mt-[-8px]">
                    <div className={`${medal.bg} w-64 h-64 rounded-full shadow-md flex flex-col items-center justify-center p-4`}>
                      <FaCrown className={`mb-2 text-3xl ${medal.crown}`} />
                      <h2 className="text-xl font-bold">{user.nickname}</h2>
                      <p className="text-sm">{calculateGrade(user.accumulatedPoints)}</p>
                      <p className="text-xs">이번달 Eco XP: {user.monthlyPoints}</p>
                      <p className="text-xs">총 Eco XP: {user.accumulatedPoints}</p>
                    </div>
                  </div>
                  <div className="mt-2 font-bold text-sm">{user.ranking}위</div>
                </div>
              );
            })}
          </div>
        </div>

        {(selectedApartment === "공주아파트" || selectedApartment === "종합랭킹") && userCards.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <Card className="p-0 overflow-hidden border border-gray-300 rounded-lg flex flex-col h-full">
              {userCards.map((user, idx) => {
                let rankDifference = '';
                if (user.position === 'current') {
                  const totalUsers = rankingData.userApartmentRankings.length || 1;
                  const percent = Math.round(((user.ranking) / totalUsers) * 100);
                  rankDifference = `상위 ${percent}%`;
                } else if (user.position === 'above') {
                  rankDifference = `${Math.abs(rankingData.user.monthlyPoints - user.monthlyPoints)}🌱 차이!`;
                } else if (user.position === 'below') {
                  rankDifference = `${user.nickname}님이 맹 추격중!`;
                }
                return (
                  <UserCard
                    key={user.uid}
                    nickname={user.nickname}
                    monthlyPoints={user.monthlyPoints}
                    accumulatedPoints={user.accumulatedPoints}
                    rank={`${user.ranking}위`}
                    rankDifference={rankDifference}
                    highlight={user.position === 'current'}
                    isFirst={idx === 0}
                    isLast={idx === (userCards.length - 1)}
                  />
                );
              })}
            </Card>
            <div className="flex flex-col gap-6">
              <EcoProgressBar
                totalXP={rankingData.user.accumulatedPoints}
                monthlyPoints={rankingData.user.monthlyPoints}
              />
              <img
                src="/Ranking/Character_Card.png"
                alt="Character Card"
                className="mx-auto rounded-lg shadow-md mt-4 cursor-pointer"
                onClick={() => navigate("/ranking/rank_tier_guide", { state: { scrollTo: 3 } })}
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">🏆 {selectedApartment} 랭킹보드</h2>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <Card key={user.uid} className="flex items-center p-4 mb-2 shadow-sm bg-white">
                <span className="text-xl font-bold w-12">{user.ranking}위</span>
                <div className="w-16 h-16 bg-black rounded-full mx-4"></div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{user.nickname}</h3>
                  <p className="text-sm text-gray-600">{calculateGrade(user.accumulatedPoints)}</p>
                  <div className="w-full bg-gray-200 h-4 rounded mt-2 mb-1">
                    <div className="bg-green-400 h-4 rounded" style={{ width: `${(user.monthlyPoints / 10000) * 100}%` }}></div>
                  </div>
                  <p className="text-gray-600 text-sm">이번달 Eco XP🌱: {user.monthlyPoints} / 10000</p>
                  <p className="text-gray-600 text-sm">총 Eco XP🌳: {user.accumulatedPoints}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">랭킹 데이터가 없습니다.</p>
          )}
          <div className="flex justify-center mt-4">
            <Button onClick={handlePrevPage} disabled={currentPage === 1} className="mx-2 bg-black text-white">
              이전
            </Button>
            {[...Array(Math.ceil(rankingBoardData.length / usersPerPage)).keys()].map((page) => (
              <Button
                key={page + 1}
                onClick={() => setCurrentPage(page + 1)}
                className={
                  currentPage === page + 1
                    ? "bg-black text-white mx-1"
                    : "bg-white border border-black text-black mx-1"
                }
              >
                {page + 1}
              </Button>
            ))}
            <Button onClick={handleNextPage} disabled={currentPage >= Math.ceil(rankingBoardData.length / usersPerPage)} className="mx-2 bg-black text-white">
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
