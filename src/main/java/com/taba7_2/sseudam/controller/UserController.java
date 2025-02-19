package com.taba7_2.sseudam.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.model.User;
import com.taba7_2.sseudam.repository.UserRepository;
import com.taba7_2.sseudam.repository.RankAccountRepository;
import com.taba7_2.sseudam.service.AIAnalysisService;
import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.RankCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final FirebaseAuthService firebaseAuthService;
    private final RankAccountRepository rankAccountRepository;
    private final RankCalculatorService rankCalculatorService;
    private final AIAnalysisService aiAnalysisService;

    @Autowired
    public UserController(UserRepository userRepository, FirebaseAuthService firebaseAuthService,
                          RankAccountRepository rankAccountRepository, RankCalculatorService rankCalculatorService,
                          AIAnalysisService aiAnalysisService) {
        this.userRepository = userRepository;
        this.firebaseAuthService = firebaseAuthService;
        this.rankAccountRepository = rankAccountRepository;
        this.rankCalculatorService = rankCalculatorService;
        this.aiAnalysisService = aiAnalysisService;
    }

    /**
     * ✅ [POST] 사용자 로그인 API (Firebase 인증)
     * - Firebase 토큰을 검증하고 사용자 정보를 반환
     * - 로그인 성공 시 `last_login` 업데이트
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // ✅ Firebase 인증 토큰 검증
            if (!authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Invalid Authorization header format");
            }
            String token = authorizationHeader.substring(7);
            FirebaseToken decodedToken = firebaseAuthService.verifyToken(token);
            String uid = decodedToken.getUid();

            // ✅ 사용자 조회
            Optional<User> userOptional = userRepository.findById(uid);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).body("User not found in database");
            }

            User user = userOptional.get();
            user.setLastLogin(new Date());
            userRepository.save(user);

            // ✅ 사용자 등급 & 포인트 조회
            Optional<RankAccount> rankAccountOptional = rankAccountRepository.findById(uid);
            int accumulatedPoints = rankAccountOptional.map(RankAccount::getAccumulatedPoints).orElse(0);
            int monthlyPoints = rankAccountOptional.map(RankAccount::getMonthlyPoints).orElse(0);
            String grade = rankCalculatorService.getGrade(accumulatedPoints);
            int pointsNeededForPromotion = rankCalculatorService.getPointsNeededForNextGrade(accumulatedPoints);

            // ✅ 최근 6일 사용자 분석 결과 조회
            List<Map<String, Object>> recentAnalysis = aiAnalysisService.getRecentAnalysisResults(uid);

            // ✅ 월별 재질별 평균 성공률 조회
            Map<String, List<Map<String, Object>>> monthlyMaterialSuccessRates = aiAnalysisService.getMonthlyMaterialSuccessRates(uid);

            // ✅ 최근 5개월 사용자 평균 성공률 조회
            Map<String, Double> userMonthlyAvgSuccess = aiAnalysisService.getUserMonthlyAvgSuccess(uid);

            // ✅ 최근 5개월 아파트 평균 성공률 조회
            Long apartmentId = rankAccountOptional.map(RankAccount::getApartmentId).orElse(null);
            Map<String, Double> apartmentMonthlyAvgSuccess = apartmentId != null ?
                    aiAnalysisService.getApartmentMonthlyAvgSuccess(apartmentId) : Collections.emptyMap();

            // ✅ 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("email", user.getEmail());
            response.put("nickname", user.getNickname());
            response.put("created_at", user.getCreatedAt());
            response.put("last_login", user.getLastLogin());
            response.put("accumulatedPoints", accumulatedPoints);
            response.put("monthlyPoints", monthlyPoints);
            response.put("grade", grade);
            response.put("pointsNeededForPromotion", pointsNeededForPromotion);
            response.put("recentAnalysis", recentAnalysis);
            response.put("monthlyMaterialSuccessRates", monthlyMaterialSuccessRates);
            response.put("userMonthlyAvgSuccess", userMonthlyAvgSuccess);
            response.put("apartmentMonthlyAvgSuccess", apartmentMonthlyAvgSuccess);
            response.put("redirect_url", "/home");

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}