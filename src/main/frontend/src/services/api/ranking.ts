import api from "@/api/axiosInstance";
import { RankingResponse } from "@/types/RankingResponse";

// ✅ Firebase 사용자 토큰 하드코딩 (테스트용)
const getFirebaseToken = async (): Promise<string> => {
  // 아래 하드코딩된 토큰을 사용합니다.
  return "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYmJiZDI2NjNhY2U4OTU4YTFhOTY4ZmZjNDQxN2U4MDEyYmVmYmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVjeWxpbmctMzIyNWEiLCJhdWQiOiJyZWN5bGluZy0zMjI1YSIsImF1dGhfdGltZSI6MTc0MDExMTczMywidXNlcl9pZCI6IlU0TjJTR3dZSjZRMHV5c25oZVlLSHdtSWlTQTIiLCJzdWIiOiJVNE4yU0d3WUo2UTB1eXNuaGVZS0h3bUlpU0EyIiwiaWF0IjoxNzQwMTExNzM0LCJleHAiOjE3NDAxMTUzMzQsImVtYWlsIjoiY3Jvc2Vmcm9nQG5hbmVyLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjcm9zZWZyb2dAbmFuZXIuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.zqmHMKqbp_JZxDrfipKvCL6Jen8whuO3k_e7wG_2xRli96Icaf8TuTzfB4EipE_kL3NcSkbyONrie39A-ZhLNq9nwQaTNWzF45_DejIfPPtYzBARFw-QWemjWI81NKBhxPKRjPgHqNIRv_5LjY14j--wdezImX95zh7N35fjtdDzgSUNYL31KUxjSjK0bUti5GdP63QaFdFxUcsR9Fhj4OyFbOOAgfeKdnTBXYYCo4xt1o9_rs4tYZ-KUZcvKvHC-arEiE0CxPcOSWYEvtZzWscINwtq9xUtSDrlDxKdw_IY2gSg4XnUgB_JgKiNcjG-kjdWS7uwHxrbJPEEsMaaFw";
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
