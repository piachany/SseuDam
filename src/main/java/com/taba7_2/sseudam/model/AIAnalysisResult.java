package com.taba7_2.sseudam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "analysis_result_data")
public class AIAnalysisResult {

    @Id
    private String uid;  // 사용자 UID (고유값)

    @Column(nullable = false)
    private int points;  // 최종 포인트

    @Column(nullable = false)
    private int successPercent;  // AI 성공률 (0~100%)

    @Column(nullable = false)
    private int earned;  // 획득 포인트

    @Column(nullable = false)
    private int inearned;  // 차감 포인트 (기존 inearned 유지)

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  // 분석 시간

    @Column(nullable = true)
    private String material;  // 재질 정보 (nullable)

    @Column(nullable = true)
    private Long apartmentId;  // 아파트 ID (nullable)

    public AIAnalysisResult(String uid, int points, int successPercent, int earned, int inearned,
                            String material, Long apartmentId) {
        this.uid = uid;
        this.points = points;
        this.successPercent = successPercent;
        this.earned = earned;
        this.inearned = inearned;
        this.material = material;
        this.apartmentId = apartmentId;
    }
}
