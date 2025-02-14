package com.taba7_2.sseudam.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class RankingResponseDto {
    private RankingDto currentUser;
    private RankingDto aboveUser;
    private RankingDto belowUser;
    private List<RankingDto> globalRankings;
}