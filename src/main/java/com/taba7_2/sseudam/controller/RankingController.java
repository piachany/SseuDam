package com.taba7_2.sseudam.controller;

import com.taba7_2.sseudam.service.RankingService;
import com.taba7_2.sseudam.dto.RankingResponseDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    /**
     * ✅ 특정 아파트의 사용자 중심 랭킹 조회 (월별)
     * ✅ 사용자가 선택한 아파트의 랭킹만 반환
     */
    @GetMapping
    public RankingResponseDto getApartmentRankings(@RequestHeader("Authorization") String authorizationHeader,
                                                   @RequestParam("month") int month,
                                                   @RequestParam(value = "apartment_id", required = false) Long apartmentId) {
        return rankingService.getRankingsForUser(authorizationHeader, month, apartmentId);
    }
}