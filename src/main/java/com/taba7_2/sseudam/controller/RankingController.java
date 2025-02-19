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

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(required = false) String apartmentId
    ) {
        try {
            // 🔹 Firebase 인증을 통해 사용자 UID 가져오기
            String userUid = firebaseAuthService.getUidFromToken(authorizationHeader);
            Optional<RankAccount> userRankOpt = rankingService.getUserRanking(userUid);

            if (userRankOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "User ranking not found"));
            }

            RankAccount user = userRankOpt.get();

            // 🔹 현재 사용자의 아파트 랭킹 조회
            List<Map<String, Object>> userApartmentRankings = rankingService.getApartmentRankings(user.getApartmentId());

            // 🔹 특정 아파트 랭킹 조회 (apartmentId가 명시적으로 주어졌을 경우에만)
            List<Map<String, Object>> selectedApartmentRankings = null;
            if (apartmentId != null) {
                if (apartmentId.equals("all")) {
                    selectedApartmentRankings = rankingService.getAllRankings();
                } else {
                    try {
                        Long apartmentIdLong = Long.parseLong(apartmentId);
                        selectedApartmentRankings = rankingService.getApartmentRankings(apartmentIdLong);
                    } catch (NumberFormatException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", "Invalid apartmentId format"));
                    }
                }
            }

            // 🔹 사용자 위/아래 랭킹 가져오기
            Map<String, Object> aboveUser = rankingService.getAboveUser(user.getApartmentId(), userUid);
            Map<String, Object> belowUser = rankingService.getBelowUser(user.getApartmentId(), userUid);

            // 🔹 현재 사용자의 등급 정보 가져오기
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
            response.put("userApartmentRankings", userApartmentRankings);
            response.put("selectedApartmentRankings", selectedApartmentRankings);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Internal Server Error: " + e.getMessage()));
        }
    }
}