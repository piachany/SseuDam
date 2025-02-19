import api from "@/api/axiosInstance";
import { RankingResponse } from "@/types/RankingResponse";

// ✅ Firebase 사용자 토큰 하드코딩 (테스트용)
const getFirebaseToken = async (): Promise<string> => {
  // 아래 하드코딩된 토큰을 사용합니다.
  return "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjBjYmJiZDI2NjNhY2U4OTU4YTFhOTY4ZmZjNDQxN2U4MDEyYmVmYmUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVjeWxpbmctMzIyNWEiLCJhdWQiOiJyZWN5bGluZy0zMjI1YSIsImF1dGhfdGltZSI6MTczOTk1MzEwOCwidXNlcl9pZCI6IlU0TjJTR3dZSjZRMHV5c25oZVlLSHdtSWlTQTIiLCJzdWIiOiJVNE4yU0d3WUo2UTB1eXNuaGVZS0h3bUlpU0EyIiwiaWF0IjoxNzM5OTUzMTA5LCJleHAiOjE3Mzk5NTY3MDksImVtYWlsIjoiY3Jvc2Vmcm9nQG5hbmVyLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjcm9zZWZyb2dAbmFuZXIuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.LlJRy1B6oP9VLx1wEErlHVbbeUoKhcNy1us8xuXdY32RMlhtgZo8OnVJysh3jUPj2GmXeiXhP4kc0g6cTgEQOJNSVdhmROXketFNqc4MRJH8xv7ovO2XBAwWaj2-a0NVA_EhiuA1ggWzNXy4CNC6V6CHNSWiEzGULfA5s50ErqeDUddRgKJNPy4dXJ2kcOIVVhvyd44fIf3n7QJwhfoxq9wclyrYVDmG67Fqr_LPha-yto0L1C_lny8cmfAr_ZwVBSlZlGxkRDEP3kOK5I7HXzzJqpJb_2aaEJzl_wnuVdFtqowAbXBGGh4T7cb5Y9cV0Cf937E6A5cz9jtb8yJ79Q";
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
