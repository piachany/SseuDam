package com.taba7_2.sseudam.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.model.User;
import com.taba7_2.sseudam.repository.UserRepository;
import com.taba7_2.sseudam.repository.RankAccountRepository;
import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.RankCalculatorService; // ✅ RankCalculatorService 추가
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final FirebaseAuthService firebaseAuthService;
    private final RankAccountRepository rankAccountRepository;
    private final RankCalculatorService rankCalculatorService;  // ✅ RankCalculatorService 추가

    @Autowired
    public UserController(UserRepository userRepository, FirebaseAuthService firebaseAuthService, RankAccountRepository rankAccountRepository, RankCalculatorService rankCalculatorService) {
        this.userRepository = userRepository;
        this.firebaseAuthService = firebaseAuthService;
        this.rankAccountRepository = rankAccountRepository;
        this.rankCalculatorService = rankCalculatorService;
    }

    /**
     * ✅ [POST] 사용자 로그인 API (Firebase 인증)
     * - Firebase 토큰을 검증하고 사용자의 정보를 반환
     * - 로그인 성공 시 `last_login` 업데이트
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // ✅ Authorization 헤더에서 Bearer 토큰 추출
            if (!authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Invalid Authorization header format");
            }
            String token = authorizationHeader.substring(7);

            // ✅ Firebase 토큰 검증
            FirebaseToken decodedToken = firebaseAuthService.verifyToken(token);
            String uid = decodedToken.getUid();

            // ✅ 데이터베이스에서 사용자 조회
            Optional<User> userOptional = userRepository.findById(uid);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).body("User not found in database");
            }

            User user = userOptional.get();

            // ✅ 로그인 시 `last_login` 업데이트
            user.setLastLogin(new Date());
            userRepository.save(user);

            // ✅ RankAccount 정보 가져오기
            Optional<RankAccount> rankAccountOptional = rankAccountRepository.findById(uid);
            int accumulatedPoints = rankAccountOptional.map(RankAccount::getAccumulatedPoints).orElse(0);
            int monthlyPoints = rankAccountOptional.map(RankAccount::getMonthlyPoints).orElse(0);

            // ✅ 랭크 및 승급 필요 포인트 계산 (RankCalculatorService 활용)
            String currentTier = rankCalculatorService.getTier(accumulatedPoints);
            int pointsNeededForPromotion = rankCalculatorService.getPointsNeededForNextTier(accumulatedPoints);

            // ✅ 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("email", user.getEmail());
            response.put("nickname", user.getNickname());
            response.put("created_at", user.getCreatedAt());
            response.put("last_login", user.getLastLogin());
            response.put("accumulated_points", accumulatedPoints);
            response.put("monthly_points", monthlyPoints);
            response.put("current_tier", currentTier);
            response.put("points_needed_for_promotion", pointsNeededForPromotion);
            response.put("redirect_url", "/home");

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}