import { getAptRank } from "@/services/api/ranking";
import { RankingResponse, RankingUser } from "@/types/RankingResponse";

// 📝 User 데이터 타입 정의
export interface User {
  rank: number;
  name: string;
  grade: string;
  monthlyPoints: number;
  totalPoints: number;
  apartment: string; // 아파트 필드
  bgColor?: string;
  crownColor?: string;
}

// API로 받아온 RankingUser 데이터를 내부 User로 매핑하는 함수
const mapRankingUser = (apiUser: RankingUser): User => {
  let apartmentName = "";
  if (apiUser.apartmentId === 1) apartmentName = "공주아파트";
  else if (apiUser.apartmentId === 2) apartmentName = "왕자아파트";
  else if (apiUser.apartmentId === 3) apartmentName = "주공아파트";
  else apartmentName = "Unknown";

  return {
    // 기존 ranking 값은 무시하고, 추후 재할당할 예정입니다.
    rank: apiUser.ranking,
    name: apiUser.nickname,
    grade: apiUser.grade,
    monthlyPoints: apiUser.monthlyPoints,
    totalPoints: apiUser.accumulatedPoints,
    apartment: apartmentName,
  };
};

// selectedApartment 값에 따라 API에서 데이터를 받아와 매핑한 후 반환
// selectedApartment: "공주아파트", "왕자아파트", "주공아파트", "종합랭킹" 중 하나
export const fetchUsers = async (
  selectedApartment: string
): Promise<{ users: User[]; currentUser: User | null }> => {
  try {
    let aptParam = "";
    if (selectedApartment === "공주아파트") aptParam = "1";
    else if (selectedApartment === "왕자아파트") aptParam = "2";
    else if (selectedApartment === "주공아파트") aptParam = "3";
    else if (selectedApartment === "종합랭킹") aptParam = "all";

    const data: RankingResponse = await getAptRank(aptParam);
    const apiUsers = data.selectedApartmentRankings || [];
    let mappedUsers = apiUsers.map(mapRankingUser);

    // 이번달 Eco XP(즉, monthlyPoints)를 기준으로 내림차순 정렬
    mappedUsers.sort((a, b) => b.monthlyPoints - a.monthlyPoints);

    // 정렬된 순서에 따라 rank 재할당 및 상위 3등 메달 색상 지정
    mappedUsers = mappedUsers.map((user, index) => {
      const newUser = { ...user, rank: index + 1 };
      if (index === 0) {
        newUser.bgColor = "bg-yellow-100";  // 1등: 금색
        newUser.crownColor = "text-yellow-400";
      } else if (index === 1) {
        newUser.bgColor = "bg-gray-200";     // 2등: 은색
        newUser.crownColor = "text-gray-400";
      } else if (index === 2) {
        newUser.bgColor = "bg-orange-100";   // 3등: 동색
        newUser.crownColor = "text-orange-400";
      }
      return newUser;
    });

    // 현재 사용자 데이터는 그대로 매핑 (필요시 별도 처리 가능)
    const currentUser = data.user ? mapRankingUser(data.user) : null;
    return { users: mappedUsers, currentUser };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], currentUser: null };
  }
};