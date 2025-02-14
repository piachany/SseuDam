package com.taba7_2.sseudam.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class FirebaseAuthService {

    private final FirebaseAuth firebaseAuth;

    public FirebaseAuthService(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    /**
     * Firebase JWT 검증
     * @param token 클라이언트에서 받은 JWT 토큰
     * @return FirebaseToken (검증된 사용자 정보 포함)
     */
    public FirebaseToken verifyToken(String token) throws FirebaseAuthException {
        return firebaseAuth.verifyIdToken(token);
    }

    /**
     * ✅ Authorization 헤더에서 Firebase UID 가져오기
     */
    public String getUidFromToken(String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
            return decodedToken.getUid();
        } catch (Exception e) {
            throw new RuntimeException("Invalid Firebase Token");
        }
    }
}