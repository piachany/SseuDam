package com.taba7_2.sseudam.controller;

import com.google.firebase.auth.FirebaseToken;
import com.taba7_2.sseudam.service.FirebaseAuthService;
import com.taba7_2.sseudam.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    private final FirebaseAuthService firebaseAuthService;
    private final UserService userService;

    public HomeController(FirebaseAuthService firebaseAuthService, UserService userService) {
        this.firebaseAuthService = firebaseAuthService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getHomeData(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String idToken = authorizationHeader.replace("Bearer ", "");
            FirebaseToken decodedToken = firebaseAuthService.verifyToken(idToken);
            String uid = decodedToken.getUid();

            // 사용자 데이터 조회
            Map<String, Object> userData = userService.getUserData(uid);

            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }
}
