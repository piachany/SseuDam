package com.taba7_2.sseudam.service;

import org.springframework.stereotype.Service;

@Service
public class RankCalculatorService {

    // ✅ 티어 설정
    private static final int[] TIER_THRESHOLDS = {500, 1300, 2800, 5000};
    private static final String[] TIER_NAMES = {
            "💀 환경 테러범",
            "🗑 분리배출 견습생",
            "🌿 지구 친구",
            "🌍 지구 지킴이",
            "🏆 에코히어로"
    };

    /**
     * ✅ 누적 포인트를 기반으로 티어를 결정
     */
    public static String getTier(int accumulatedPoints) {
        if (accumulatedPoints < 500) {
            return "💀 환경 테러범";
        } else if (accumulatedPoints < 1300) {
            return "🗑 분리배출 견습생";
        } else if (accumulatedPoints < 2800) {
            return "🌿 지구 친구";
        } else if (accumulatedPoints < 5000) {
            return "🌍 지구 지킴이";
        } else {
            return "🏆 에코히어로";
        }
    }

    /**
     * ✅ 다음 등급까지 필요한 포인트 계산
     */
    public static int getPointsNeededForNextTier(int accumulatedPoints) {
        for (int threshold : TIER_THRESHOLDS) {
            if (accumulatedPoints < threshold) {
                return threshold - accumulatedPoints;
            }
        }
        return 0; // 이미 최상위 등급이면 0 반환
    }
}