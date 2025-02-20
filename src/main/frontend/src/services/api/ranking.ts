import api from "@/api/axiosInstance";
import { RankingResponse } from "@/types/RankingResponse";

// ✅ Firebase 사용자 토큰 하드코딩 (테스트용)
const getFirebaseToken = async (): Promise<string> => {
  // 아래 하드코딩된 토큰을 사용합니다.
  return "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYmJiZDI2NjNhY2U4OTU4YTFhOTY4ZmZjNDQxN2U4MDEyYmVmYmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVjeWxpbmctMzIyNWEiLCJhdWQiOiJyZWN5bGluZy0zMjI1YSIsImF1dGhfdGltZSI6MTc0MDAzNzE2MiwidXNlcl9pZCI6IlU0TjJTR3dZSjZRMHV5c25oZVlLSHdtSWlTQTIiLCJzdWIiOiJVNE4yU0d3WUo2UTB1eXNuaGVZS0h3bUlpU0EyIiwiaWF0IjoxNzQwMDM3MTY0LCJleHAiOjE3NDAwNDA3NjQsImVtYWlsIjoiY3Jvc2Vmcm9nQG5hbmVyLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjcm9zZWZyb2dAbmFuZXIuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.08A0OtU0xkWEKTWd6-YIaXcPNxcovHmBnc6WvimKgOLJDGwPKsSYg6dbjbEW4JTEcqQxcEpersSdFz-U3lqVuCs6p9buiPM3ZJ6cBWVOLHENy2VV81ttkZgKqwWOdBfrHUrPQcXX0C7k6LuwTxS1F0GCcl5RD3P2v3uLNKi3H-02uO0oHaf3DjsogoLy78Y20Ugw8WM-ZYI_LuTF69RIffbHxV7MhcSCFMaYB0da7eGWmFMn6mM-5kYG-YmjARBCM49fTXTxKEINjz22q8XlQsoXtr1V7uYPEWmakT7Pda8lfgJj_3p_wteDqTMl8YMoGnKp-gi-2cti8hoGvO6ulw";
};

export const getAptRank = async (apartmentId: string): Promise<RankingResponse> => {
    try {
        const token = await getFirebaseToken();
        const response = await api.get<RankingResponse>(`/rankings?apartmentId=${apartmentId}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching apartment ranking:", error);
        throw error;
    }
};
