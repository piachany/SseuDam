package com.taba7_2.sseudam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RankingDto {
    private String uid;
    private String nickname;
    private int monthlyPoints;
    private int accumulatedPoints;
    private int ranking;
    private String tier;
}