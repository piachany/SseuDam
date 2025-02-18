package com.taba7_2.sseudam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "material_success")
public class MaterialSuccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String uid;  // 사용자 고유 ID

    @Column(nullable = false)
    private String material;  // 검사한 재질

    @Column(nullable = false)
    private int totalAttempts = 0;  // 총 검사 횟수

    @Column(nullable = false)
    private int successfulAttempts = 0;  // 성공 횟수

    @Column(nullable = false)
    private double successRate = 0.00;  // 성공률 (%)

    public MaterialSuccess(String uid, String material) {
        this.uid = uid;
        this.material = material;
    }

    public void updateSuccessRate(boolean isSuccess) {
        this.totalAttempts++;
        if (isSuccess) {
            this.successfulAttempts++;
        }
        this.successRate = (double) successfulAttempts / totalAttempts * 100;
    }
}
