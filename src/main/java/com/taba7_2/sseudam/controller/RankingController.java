package com.taba7_2.sseudam.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.RankCalculatorService;
import com.taba7_2.sseudam.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {
    private final RankingService rankingService;
    private final FirebaseAuthService firebaseAuthService;
    private final RankCalculatorService rankCalculatorService;

    public RankingController(RankingService rankingService, FirebaseAuthService firebaseAuthService, RankCalculatorService rankCalculatorService) {
        this.rankingService = rankingService;
        this.firebaseAuthService = firebaseAuthService;
        this.rankCalculatorService = rankCalculatorService;
    }

    /**
     * ✅ /api/rankings - 모든 랭킹 정보 제공 (전체 랭킹 or 특정 아파트 랭킹)
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) Long apartmentId
    ) {
        try {
            // 🔹 Firebase 토큰에서 UID 가져오기
            String userUid = firebaseAuthService.getUidFromToken(authorizationHeader);
            int currentMonth = java.time.LocalDate.now().getMonthValue();

            // 🔹 사용자 정보 가져오기
            Optional<RankAccount> userRankOpt = rankingService.getUserRanking(userUid);
            if (userRankOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "User ranking not found"));
            }
            RankAccount user = userRankOpt.get();

            // 🔹 TOP 3 랭킹 조회
            List<Map<String, Object>> top3Users = rankingService.getTop3Rankings(currentMonth);

            // 🔹 사용자의 아파트 랭킹 조회
            List<Map<String, Object>> userApartmentRankings = rankingService.getApartmentRankings(user.getApartmentId(), currentMonth);

            // 🔹 전체 랭킹 조회 (apartmentId가 null이면 전체 조회)
            List<Map<String, Object>> allRankings = (apartmentId == null)
                    ? rankingService.getAllRankings(currentMonth)
                    : null;

            // 🔹 특정 아파트의 전체 랭킹 (배너에서 선택한 경우)
            List<Map<String, Object>> selectedApartmentRankings = (apartmentId != null)
                    ? rankingService.getApartmentRankings(apartmentId, currentMonth)
                    : null;

            // 🔹 사용자의 위/아래 랭킹 찾기
            Map<String, Object> aboveUser = rankingService.getAboveUser(user.getApartmentId(), currentMonth, userUid);
            Map<String, Object> belowUser = rankingService.getBelowUser(user.getApartmentId(), currentMonth, userUid);

            // 🔹 월별 획득 포인트 조회
            List<Map<String, Object>> monthlyPoints = rankingService.getMonthlyPoints(userUid);

            String grade = rankCalculatorService.getGrade(user.getAccumulatedPoints());

            // ✅ 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("user", Map.of(
                    "userUid", user.getUid(),
                    "nickname", user.getNickname(),
                    "grade", grade,
                    "apartmentId", user.getApartmentId(),
                    "monthlyPoints", user.getMonthlyPoints(),
                    "accumulatedPoints", user.getAccumulatedPoints()
            ));
            response.put("aboveUser", aboveUser);
            response.put("belowUser", belowUser);
            response.put("top3Users", top3Users);
            response.put("userApartmentRankings", userApartmentRankings);
            response.put("selectedApartmentRankings", selectedApartmentRankings);
            response.put("allRankings", allRankings);
            response.put("monthlyPoints", monthlyPoints);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Internal Server Error: " + e.getMessage()));
        }
    }
}
