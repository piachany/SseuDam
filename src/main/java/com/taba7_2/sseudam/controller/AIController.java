package com.taba7_2.sseudam.controller;

import com.taba7_2.sseudam.model.AIAnalysisResult;
import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.model.MaterialSuccess;
import com.taba7_2.sseudam.repository.AIAnalysisResultRepository;
import com.taba7_2.sseudam.repository.MaterialSuccessRepository;
import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.RankCalculatorService;
import com.taba7_2.sseudam.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final WebClient webClient;
    private final RankingService rankingService;
    private final RankCalculatorService rankCalculatorService;
    private final AIAnalysisResultRepository aiAnalysisResultRepository;
    private final MaterialSuccessRepository materialSuccessRepository;
    private final FirebaseAuthService firebaseAuthService;

    public AIController(WebClient.Builder webClientBuilder, RankingService rankingService,
                        RankCalculatorService rankCalculatorService, AIAnalysisResultRepository aiAnalysisResultRepository,
                        MaterialSuccessRepository materialSuccessRepository, FirebaseAuthService firebaseAuthService) {
        this.webClient = webClientBuilder.baseUrl("http://localhost:5001").build();
        this.rankingService = rankingService;
        this.rankCalculatorService = rankCalculatorService;
        this.aiAnalysisResultRepository = aiAnalysisResultRepository;
        this.materialSuccessRepository = materialSuccessRepository;
        this.firebaseAuthService = firebaseAuthService;
    }

    /**
     * ✅ 성공률에 따라 포인트를 세분화하여 부여 및 차감하는 함수
     * 최대 획득: 50점, 최대 차감: -50점 (1점 단위 세분화)
     *
     * @param successRate 성공률 (0~100)
     * @return Map<String, Integer> (earned: 획득 포인트, deducted: 차감 포인트)
     */
    private Map<String, Integer> calculatePoints(int successRate) {
        int earned, deducted;

        if (successRate >= 70) {
            // ✅ 70% 이상: 획득 포인트 계산 (비례식 사용)
            earned = (int) Math.round((successRate - 70) * (50.0 / 30.0)); // 70~100 → 0~50
            deducted = 0;
        } else {
            // ✅ 70% 미만: 차감 포인트 계산 (비례식 사용)
            earned = 0;
            deducted = (int) Math.round((70 - successRate) * (50.0 / 70.0)); // 0~69 → 50~0
        }

        return Map.of("earned", earned, "deducted", deducted);
    }

    @GetMapping("/results")
    public ResponseEntity<?> getAIResults(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam String selectedCategory // ✅ 사용자가 선택한 검사 카테고리
    ) {
        try {
            // ✅ Flask AI 서버에서 JSON 결과 가져오기
            Map<String, List<Map<String, Object>>> response = webClient.get()
                    .uri("/results")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> processedResults = Optional.ofNullable(response)
                    .map(Map::values)
                    .flatMap(values -> values.stream().findFirst())
                    .orElse(null);

            if (processedResults == null || processedResults.isEmpty()) {
                return ResponseEntity.status(500).body(Map.of("error", "AI 분석 결과가 없습니다."));
            }

            // ✅ 사용자 UID & 아파트 ID 가져오기
            String userUid = firebaseAuthService.getUidFromToken(authorizationHeader);
            Long apartmentId = rankingService.getUserRanking(userUid).get().getApartmentId();

            // ✅ 감지해야 할 모든 재질 목록 (사용자가 선택한 검사 기준에 따라 다름)
            List<String> validMaterials = switch (selectedCategory) {
                case "plastic" -> List.of("plastic_PE", "plastic_PP", "plastic_PS", "plastic_bag", "PET_color");
                case "styrofoam" -> List.of("styrofoam");
                case "PET" -> List.of("PET_transparent");
                case "can" -> List.of("can_steel", "can_aluminium");
                case "glass" -> List.of("glass_brown", "glass_green", "glass_transparent");
                case "paper" -> List.of("paper");
                case "battery" -> List.of("battery");
                case "light" -> List.of("light");
                default -> new ArrayList<>();
            };

            // ✅ 1. 탐지된 전체 객체 개수
            int totalDetectedObjects = processedResults.size(); // 전체 객체 개수

            // ✅ 2. 선택한 재질에 해당하는 confidence 값 합산
            double totalValidConfidence = processedResults.stream()
                    .filter(result -> validMaterials.contains(result.get("class"))) // ✅ 사용자가 선택한 재질만 포함
                    .mapToDouble(result -> (Double) result.get("confidence") * 100) // ✅ 퍼센트 변환
                    .sum();

            // ✅ 3. 최종 성공률 계산 (선택한 재질 합산 / 탐지된 전체 객체 개수)
            int finalSuccessRate = totalDetectedObjects > 0
                    ? (int) Math.round(totalValidConfidence / totalDetectedObjects)
                    : 0; // 탐지된 객체가 없으면 0%

            // ✅ 4. 포인트 계산 (1점 단위 적용)
            Map<String, Integer> points = calculatePoints(finalSuccessRate);
            int earned = points.get("earned");
            int deducted = points.get("deducted");

            boolean isSuccess = finalSuccessRate >= 70;

            // ✅ 5. 포인트 업데이트
            rankingService.updateUserPoints(userUid, earned - deducted);

            // ✅ 6. 검사 결과 DB 저장
            AIAnalysisResult aiResult = new AIAnalysisResult(
                    userUid, rankingService.getUserRanking(userUid).get().getAccumulatedPoints(),
                    finalSuccessRate, earned, deducted, selectedCategory, apartmentId
            );
            aiAnalysisResultRepository.save(aiResult);

            // ✅ 7. `material_success` 테이블 업데이트
            MaterialSuccess materialSuccess = materialSuccessRepository.findByUidAndMaterial(userUid, selectedCategory)
                    .orElse(new MaterialSuccess(userUid, selectedCategory));

            materialSuccess.updateSuccessRate(isSuccess);
            materialSuccessRepository.save(materialSuccess);

            // ✅ 8. 프론트엔드에 최종 결과 전송
            Map<String, Object> resultResponse = Map.of(
                    "successRate", finalSuccessRate,
                    "success", isSuccess,
                    "earned", earned,
                    "deducted", deducted,
                    "updatedMonthlyPoints", rankingService.getUserRanking(userUid).get().getMonthlyPoints(),
                    "updatedAccumulatedPoints", rankingService.getUserRanking(userUid).get().getAccumulatedPoints(),
                    "grade", rankCalculatorService.getGrade(rankingService.getUserRanking(userUid).get().getAccumulatedPoints()),
                    "pointsToNextGrade", rankCalculatorService.getPointsNeededForNextGrade(rankingService.getUserRanking(userUid).get().getAccumulatedPoints()),
                    "promotionMessage", isSuccess ? "🎉 축하합니다! 등급이 상승했습니다." : "",
                    "material", selectedCategory
            );

            return ResponseEntity.ok(resultResponse);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "AI 서버 데이터 가져오기 실패", "details", e.getMessage()));
        }
    }
}