package com.taba7_2.sseudam.controller;

import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    private final RankingService rankingService;
    private final FirebaseAuthService firebaseAuthService;

    public QuizController(RankingService rankingService, FirebaseAuthService firebaseAuthService) {
        this.rankingService = rankingService;
        this.firebaseAuthService = firebaseAuthService;
    }

    @PostMapping("/correct")
    public ResponseEntity<?> handleCorrectAnswer(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String userUid = firebaseAuthService.getUidFromToken(authorizationHeader);

            // ✅ 퀴즈 정답 시 1점 반영
            rankingService.updateUserPoints(userUid, 1);

            return ResponseEntity.ok(Map.of("message", "퀴즈 정답 처리 완료! 1점 추가됨."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "퀴즈 포인트 업데이트 실패", "details", e.getMessage()));
        }
    }
}
