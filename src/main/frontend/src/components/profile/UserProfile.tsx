import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { availableIcons } from "@/utils/iconList";

interface UserProfileProps {
  userData: {
    nickname?: string;
    email?: string;
    selectedIcon?: string;
    grade?: string;
    points_needed_for_promotion: number;
    accumulatedPoints?: number;
    monthlyPoints: number;
    last_login?: string;
    created_at?: string;
    xp?: number;
    maxXp?: number;
  };
}

// Enhanced animation CSS with segmented ocean wave gradients
const animationStyles = `
  /* Wave animation for the progress bar */
  @keyframes waveFlow {
    0%, 100% {
      transform: translateY(0) scaleY(1);
    }
    50% {
      transform: translateY(-8px) scaleY(1.1);
    }
  }

  /* Wave colors for different segments */
  .wave-segment-1 {
    background: linear-gradient(90deg, #c2e9fb 0%, #a1c4fd 100%);
  }
  
  .wave-segment-2 {
    background: linear-gradient(90deg, #89f7fe 0%, #66a6ff 100%);
  }
  
  .wave-segment-3 {
    background: linear-gradient(90deg, #48c6ef 0%, #6f86d6 100%);
  }
  
  .wave-segment-4 {
    background: linear-gradient(90deg, #0acffe 0%, #495aff 100%);
  }
  
  .wave-segment-5 {
    background: linear-gradient(90deg, #13547a 0%, #80d0c7 100%);
  }

  .wave-body {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 30%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 70%
    );
    animation: waveFlow 3s ease-in-out infinite;
  }
`;

export function UserProfile({ userData: initialUserData }: UserProfileProps) {
  const [user, setUser] = useState(initialUserData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [surfPosition, setSurfPosition] = useState(0);
  const [surfDirection, setSurfDirection] = useState(1); // 1 for forward, -1 for backward

  // Calculate experience percentage
  const totalPoints = user?.accumulatedPoints || 0;
  const pointsToNextRank = user?.points_needed_for_promotion || 0;
  const xp = user?.xp || totalPoints;
  const maxXp = user?.maxXp || (totalPoints + pointsToNextRank);
  const xpPercentage = maxXp > 0 ? (xp / maxXp) * 100 : 0;

  // Character animation that moves back and forth
  useEffect(() => {
    if (!user) return;
    
    const animationSpeed = 50; // Lower is faster
    const targetPosition = xpPercentage;
    
    const animationInterval = setInterval(() => {
      setSurfPosition(prevPos => {
        // If going forward and reached target, reverse direction
        if (surfDirection === 1 && prevPos >= targetPosition) {
          setSurfDirection(-1);
          return prevPos;
        }
        // If going backward and reached 0, reverse direction
        else if (surfDirection === -1 && prevPos <= 0) {
          setSurfDirection(1);
          return prevPos;
        }
        // Otherwise, keep moving in current direction
        return prevPos + (0.5 * surfDirection);
      });
    }, animationSpeed);
    
    return () => clearInterval(animationInterval);
  }, [xpPercentage, surfDirection, user]);

  // Load saved icon on page load and add styles
  useEffect(() => {
    const storedIcon = localStorage.getItem("selectedIcon");
    if (storedIcon && user) {
      setUser((prev) => ({ ...prev, selectedIcon: storedIcon }));
    }

    // Dynamically add styles
    const styleElement = document.createElement("style");
    styleElement.innerHTML = animationStyles;
    document.head.appendChild(styleElement);

    // Clean up on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!user) return null;

  // Get segment colors for each part of the progress bar
  const getSegmentElements = () => {
    const segments = [];
    const breakpoints = [0, 20, 40, 60, 80, 100];
    
    for (let i = 0; i < breakpoints.length - 1; i++) {
      const start = breakpoints[i];
      const end = breakpoints[i + 1];
      const segmentWidth = end - start;
      
      // Only show segments that are part of the current progress
      if (start < xpPercentage) {
        const actualWidth = Math.min(segmentWidth, xpPercentage - start);
        const widthPercent = (actualWidth / 100) * 100;
        
        segments.push(
          <div 
            key={`segment-${i}`}
            className={`absolute inset-y-0 wave-segment-${i + 1}`}
            style={{
              left: `${start}%`,
              width: `${widthPercent}%`,
              transition: "width 0.5s ease-in-out"
            }}
          >
            <div className="wave-body h-full" />
          </div>
        );
      }
    }
    
    return segments;
  };

  return (
    <div className="bg-green-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center border border-green-300 shadow-green-400">
        <div className="text-center text-green-700 bg-green-200 p-4 rounded-md mb-6">
          <p className="font-semibold text-lg">♻️ 환경을 위한 친환경 분리배출을 시작하세요!</p>
          <p className="text-sm">지속 가능한 지구를 위한 작은 실천이 큰 변화를 만듭니다.</p>
        </div>

        {/* Profile Icon with Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="relative w-24 h-24 mx-auto cursor-pointer bg-green-200 flex items-center justify-center rounded-full border-2 border-green-400 shadow-md hover:bg-green-300 transition-all">
              {user.selectedIcon ? (
                <img
                  src={user.selectedIcon}
                  alt="사용자 아이콘"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-green-800 text-5xl">
                  {(user.nickname || "U")[0].toUpperCase()}
                </span>
              )}
            </div>
          </DialogTrigger>

          {/* Icon Selection Modal */}
          <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">아이콘 선택</h2>
            <div className="grid grid-cols-5 gap-4">
              {availableIcons.map((iconUrl) => (
                <button
                  key={iconUrl}
                  className="p-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition"
                  onClick={() => {
                    localStorage.setItem("selectedIcon", iconUrl);
                    setUser((prev) => ({ ...prev, selectedIcon: iconUrl }));
                  }}
                >
                  <img
                    src={iconUrl}
                    alt="아이콘"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <h2 className="text-2xl font-bold mt-4 text-green-900">{user.nickname || "사용자"}</h2>
        <p className="text-green-700">{user.email}</p>

        <div className="mt-4 space-y-2 text-sm text-green-600">
          <p>가입일: {new Date(user.created_at || "").toLocaleString("ko-KR")}</p>
          <p>마지막 로그인: {new Date(user.last_login || "").toLocaleString("ko-KR")}</p>
        </div>

        {/* Segmented Ocean Wave XP Bar */}
        <div className="relative w-full bg-gray-200 rounded-xl h-24 mt-6 overflow-hidden">
          {/* Segmented wave gradients */}
          {getSegmentElements()}

          {/* Level indicators */}
          <div className="absolute inset-y-0 left-0 w-full h-full pointer-events-none">
            {[20, 40, 60, 80].map((level) => (
              <div 
                key={level}
                className="absolute inset-y-0 w-px bg-white opacity-60"
                style={{ left: `${level}%` }}
              />
            ))}
          </div>

          {/* Surfing character that moves back and forth */}
          <div 
            className="absolute h-full flex items-center z-30 transition-all duration-100"
            style={{
              left: `calc(${surfPosition}% - 30px)`,
              pointerEvents: 'none'
            }}
          >
            <img
              src="https://cdn.pixabay.com/photo/2019/07/23/08/33/surf-4356930_1280.png"
              alt="서핑 캐릭터"
              className="w-16 h-16 object-contain"
              style={{
                filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.3))',
                transform: 'translateY(-10px) scaleX(' + (surfDirection < 0 ? -1 : 1) + ')',
                transition: 'transform 0.3s ease'
              }}
            />
          </div>

          {/* Percentage display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-3xl font-bold text-white drop-shadow-lg z-10">{xpPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Level indicators label */}
        <div className="relative w-full flex justify-between px-2 mt-1 mb-3 text-xs text-gray-600">
          <span>시작</span>
          <span>20%</span>
          <span>40%</span>
          <span>60%</span>
          <span>80%</span>
          <span>완료</span>
        </div>

        <div className="text-center my-4">
          <p className="text-sm font-medium text-gray-600">
            <span className="inline-block mr-1">🎯</span> 승급까지 {pointsToNextRank} P 남음
          </p>
        </div>

        {/* Current Rank and Points Needed for Promotion */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">현재 등급</p>
            <p className="text-lg font-semibold text-green-900">{user.grade || "등급 없음"}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">승급까지 필요한 포인트</p>
            <p className="text-lg font-semibold text-green-900">{pointsToNextRank} P</p>
          </div>
        </div>

        {/* Accumulated Points and Monthly Points */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">누적 포인트</p>
            <p className="text-lg font-semibold text-green-900">{totalPoints} P</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-200">
            <p className="text-sm text-green-700">월별 포인트</p>
            <p className="text-lg font-semibold text-green-900">{user.monthlyPoints || 0} P</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
