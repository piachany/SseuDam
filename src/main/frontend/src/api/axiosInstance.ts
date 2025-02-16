// src\main\frontend\src\api\axiosInstance.ts

import axios from "axios";
import { RankingData } from "../types/api"; // 실제 경로에 맞게 수정

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080/api",  // Vite proxy 설정 덕분에 자동으로 http://localhost:8080/api로 변환됨
  headers: {
    "Content-Type": "application/json",  // JSON 형식의 데이터 송수신
  },
});

/**
 * 랭킹 데이터를 가져오는 함수입니다.
 * @param apartmentId 선택적 파라미터로, 해당 아파트의 랭킹 데이터를 요청할 수 있습니다.
 * @returns RankingData 타입의 응답 데이터를 반환합니다.
 */
export async function getRankings(apartmentId?: number): Promise<RankingData> {
  try {
    // apartmentId가 전달되면 쿼리 파라미터에 포함하여 요청합니다.
    const params = apartmentId ? { apartmentId } : {};

    // axios.get<RankingData>() 형태로 제네릭을 지정하면 res.data가 RankingData 타입으로 인식됩니다.
    const res = await api.get<RankingData>("/rankings", { params });
    return res.data; // 타입 오류 없이 RankingData 구조로 반환
  } catch (error) {
    console.error("Error fetching rankings data:", error);
    throw error;
  }
}

export default api;
