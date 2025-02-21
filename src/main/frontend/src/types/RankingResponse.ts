// src/main/frontend/src/types/RankingResponse.ts

export interface RankingUser {
    apartmentId: number;
    month: number;
    grade: string;
    monthlyPoints: number;
    nickname: string;
    uid: string;
    accumulatedPoints: number;
    pointsToNextGrade: number;
    ranking: number;
}
  
export interface RankingResponse {
    aboveUser: RankingUser | null;
    belowUser: RankingUser | null;
    selectedApartmentRankings: RankingUser[] | null;
    user: RankingUser;
    userApartmentRankings: RankingUser[];
    allRankings?: RankingUser[];
    top3Users?: RankingUser[];
}
