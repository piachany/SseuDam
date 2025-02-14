package com.taba7_2.sseudam.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.taba7_2.sseudam.model.User;
import com.taba7_2.sseudam.repository.UserRepository;
import com.taba7_2.sseudam.service.FirebaseAuthService;
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

    @Autowired
    public UserController(UserRepository userRepository, FirebaseAuthService firebaseAuthService) {
        this.userRepository = userRepository;
        this.firebaseAuthService = firebaseAuthService;
    }

    /**
     * 특정 UID로 사용자 정보를 조회하는 API (Firebase 인증 적용)
     */
    @GetMapping("/{uid}")
    public ResponseEntity<?> getUserByUid(@PathVariable String uid, @RequestHeader("Authorization") String authorizationHeader) {
        try {
            // ✅ Authorization 헤더에서 Bearer 토큰 추출
            if (!authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Invalid Authorization header format");
            }
            String token = authorizationHeader.substring(7);

            // ✅ Firebase 토큰 검증
            FirebaseToken decodedToken = firebaseAuthService.verifyToken(token);
            String requestUserUid = decodedToken.getUid(); // 요청한 사용자의 UID

            // ✅ 요청한 UID와 토큰의 UID가 일치하는지 확인
            if (!requestUserUid.equals(uid)) {
                return ResponseEntity.status(403).body("Forbidden: You can only access your own data.");
            }

            // ✅ 데이터베이스에서 사용자 정보 조회
            Optional<User> userOptional = userRepository.findById(uid);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).body("User not found in database");
            }

            User user = userOptional.get();

            // ✅ 응답 데이터 구성 (null 값 허용)
            Map<String, Object> response = new HashMap<>();
            response.put("uid", user.getUid());
            response.put("username", user.getUsername());
            response.put("nickname", user.getNickname());
            response.put("email", user.getEmail());
            response.put("profile_image", user.getProfileImage()); // null 허용
            response.put("email_verified", user.isEmailVerified());
            response.put("created_at", user.getCreatedAt());
            response.put("role", user.getRole());
            response.put("apartment_id", user.getApartmentId());
            response.put("location", user.getLocation());

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
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

            // ✅ 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("email", user.getEmail());
            response.put("nickname", user.getNickname());
            response.put("created_at", user.getCreatedAt());
            response.put("last_login", user.getLastLogin());

            // ✅ 프론트엔드에서 `/home`으로 리디렉트하도록 응답 데이터 추가
            response.put("redirect_url", "/home");

            return ResponseEntity.ok(response);

        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
}