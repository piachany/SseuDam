package com.taba7_2.sseudam.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.security.Timestamp;

@Entity
@Table(name = "monthly_points", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"uid", "month"})
})
public class MonthlyPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "uid", nullable = false)
    private RankAccount user;

    @Column(nullable = false)
    private int month;  // YYYYMM 형식

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int monthlyPoints;

    @CreationTimestamp
    private Timestamp createdAt;
}
