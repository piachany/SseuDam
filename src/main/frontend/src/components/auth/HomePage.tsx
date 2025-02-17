import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UserProfile from "@/components/profile/UserProfile";
import RecyclingStats from "@/components/dashboard/RecyclingStats";
import ActionBar from "@/components/dashboard/ActionBar";
import Minigame from "@/components/layout/Minigame";
import BackgroundAnimation from "@/components/layout/BackgroudAnimation";

interface UserData {
  isGuest?: boolean;
  username?: string;
  email?: string;
  lastLogin?: string;
  createdAt?: string;
}

// YouTube 영상 링크 데이터
const environmentVideos = [
  {
    title: "지구를 위한 작은 실천",
    description: "우리가 할 수 있는 환경 보호 방법",
    thumbnail: "https://img.youtube.com/vi/qRjbcRuEYBQ/0.jpg",
    link: "https://youtu.be/qRjbcRuEYBQ?si=efuQTFdL4cnXQsq-"
  },
  {
    title: "기후 변화의 진실",
    description: "지구 온난화와 우리의 미래",
    thumbnail: "https://img.youtube.com/vi/Gg88cTs2XMc/0.jpg",
    link: "https://youtu.be/Gg88cTs2XMc?si=oLjp3Wq1EBZXjn1v"
  },
  {
    title: "재활용의 중요성",
    description: "올바른 재활용 방법과 그 영향",
    thumbnail: "https://img.youtube.com/vi/OG5-eXZwkZ4/0.jpg",
    link: "https://youtu.be/OG5-eXZwkZ4?si=kcAaJ6zj74KEHaiM"
  },
  {
    title: "친환경 라이프스타일",
    description: "일상에서 실천하는 환경 보호",
    thumbnail: "https://img.youtube.com/vi/iA10gM1D2h8/0.jpg",
    link: "https://youtu.be/iA10gM1D2h8?si=snUHlP3P_JTkoFDX"
  },
  {
    title: "지속 가능한 에너지",
    description: "신재생 에너지의 미래",
    thumbnail: "https://img.youtube.com/vi/RmeUTHkd6L8/0.jpg",
    link: "https://youtu.be/RmeUTHkd6L8?si=vuhtv1LE8ZPEheWE"
  },
  {
    title: "플라스틱 오염과 해결책",
    description: "플라스틱 문제와 대안",
    thumbnail: "https://img.youtube.com/vi/0eougPjZrd8/0.jpg",
    link: "https://youtu.be/0eougPjZrd8?si=1cMnJ4gQsFg1VmNB"
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth");
    } else {
      const parsedUser: UserData = JSON.parse(user);
      setUserData(parsedUser);
      setIsLoggedIn(!parsedUser.isGuest);
      setIsGuest(!!parsedUser.isGuest);
    }
  }, [navigate]);

  if (isLoggedIn === null) {
    return (
      <div className="relative min-h-screen">
        <BackgroundAnimation />
        <div className="relative z-50 flex justify-center items-center min-h-screen">
          <p className="text-gray-500 animate-pulse">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && !isGuest) {
    return (
      <div className="relative min-h-screen">
        <BackgroundAnimation />
        <div className="relative z-50 flex justify-center items-center min-h-screen">
          <p className="text-red-500">로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* 배경 애니메이션 고정 */}
      <BackgroundAnimation />

      <div className="relative z-50 flex">
        {/* ✅ 사이드바 (미니게임) */}
        <Minigame />

        {/* ✅ 메인 콘텐츠 */}
        <div ref={scrollContainer} className="flex-1 h-screen overflow-auto px-4">
          {isGuest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-400 bg-gray-800 p-4 rounded-md mb-6"
            >
              <p>🔹 현재 <b>게스트 계정</b>으로 접속 중입니다.</p>
              <p>🚀 더 많은 기능을 사용하려면 회원가입하세요!</p>
            </motion.div>
          )}

          {isLoggedIn && userData && (
            <div className="flex flex-col items-center w-full">
              {/* ✅ 첫 번째 화면 - 사용자 프로필 */}
              <motion.div className="w-full flex justify-center items-center px-4 md:px-20">
                <div className="w-full max-w-lg">
                  <UserProfile userData={userData} />
                </div>
              </motion.div>

              {/* ✅ 두 번째 화면 - 분리배출 통계 */}
              <motion.div className="w-full flex justify-center items-center px-4 md:px-20">
                <div className="w-full max-w-lg">
                  <RecyclingStats />
                </div>
              </motion.div>

              {/* ✅ 세 번째 화면 - 일정 Action Bar */}
              <motion.div className="w-full flex justify-center items-center px-4 md:px-20">
                <div className="w-full max-w-lg">
                  <ActionBar users={[{ name: userData.username || "사용자", avatar: "/default-avatar.png" }]} />
                </div>
              </motion.div>

              {/* ✅ 친환경 YouTube 영상 */}
              <div className="w-full max-w-4xl mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                {environmentVideos.map((video, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => window.open(video.link, '_blank')}
                    className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
                  >
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-white">
                        <h3 className="font-bold text-sm">{video.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-600">{video.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}