package com.taba7_2.sseudam.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rank_accounts")
public class RankAccount {

    @Id
    @Column(name = "uid", length = 50, nullable = false)
    private String uid;  // ✅ Firebase UID를 PK로 설정

    @Column(name = "nickname", length = 50, nullable = false)
    private String nickname;

    @Column(name = "apartment_id")
    private Long apartmentId;

    @Column(name = "month", nullable = false)
    private int month;

    @Column(name = "monthly_points", nullable = false)
    private int monthlyPoints;

    @Column(name = "accumulated_points", nullable = false)
    private int accumulatedPoints;

    @Column(name = "ranking", nullable = false)
    private int ranking;
}