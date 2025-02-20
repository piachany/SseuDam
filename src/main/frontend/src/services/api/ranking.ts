import api from "@/api/axiosInstance";
import { RankingResponse } from "@/types/RankingResponse";

// ✅ Firebase 사용자 토큰 하드코딩 (테스트용)
const getFirebaseToken = async (): Promise<string> => {
  // 아래 하드코딩된 토큰을 사용합니다.
  return "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYmJiZDI2NjNhY2U4OTU4YTFhOTY4ZmZjNDQxN2U4MDEyYmVmYmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVjeWxpbmctMzIyNWEiLCJhdWQiOiJyZWN5bGluZy0zMjI1YSIsImF1dGhfdGltZSI6MTc0MDAyMzI5MiwidXNlcl9pZCI6IlU0TjJTR3dZSjZRMHV5c25oZVlLSHdtSWlTQTIiLCJzdWIiOiJVNE4yU0d3WUo2UTB1eXNuaGVZS0h3bUlpU0EyIiwiaWF0IjoxNzQwMDIzMjkzLCJleHAiOjE3NDAwMjY4OTMsImVtYWlsIjoiY3Jvc2Vmcm9nQG5hbmVyLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjcm9zZWZyb2dAbmFuZXIuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.hYDRdeorM2RQNCTPkEikYNGX2VajGs4H08eMqA4ATAYwompHfE_HHT33qhES6qNsXXb8SfJlf9T28dHCwHaJchF0l-oYNB-lZ71IohLcqVgrkA7kAJNuP_qXbsvowYd3tfyJqdffdEEMfjwBuewqhaHTceexfBjsASsut591Q0o4lHSZyd3lBwgCmQKKhDu9dgiuZrqJkAK6VdqFdHu-oLenM6psZjW37L4i-8PlykCn4nZzAuYXFLr7F2CoB4Ea_ZYg9VcBlBloG9hp85gXbse0qk-FVIBp5yeiDE7AhwEOPFEIkQL-VbvkKVs-2RLGQKOT2ss2RcMblhnEqbO0ZQ";
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
