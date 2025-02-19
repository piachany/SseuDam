package com.taba7_2.sseudam.service;

import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.repository.MonthlyPointsRepository;
import com.taba7_2.sseudam.repository.RankAccountRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class RankingService {
    private final RankAccountRepository rankAccountRepository;
    private final MonthlyPointsRepository monthlyPointsRepository;
    private final RankCalculatorService rankCalculatorService;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket 메시지 전송

    public RankingService(RankAccountRepository rankAccountRepository, MonthlyPointsRepository monthlyPointsRepository,
                          RankCalculatorService rankCalculatorService, SimpMessagingTemplate messagingTemplate) {
        this.rankAccountRepository = rankAccountRepository;
        this.monthlyPointsRepository = monthlyPointsRepository;
        this.rankCalculatorService = rankCalculatorService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * ✅ 특정 사용자 랭킹 조회
     */
    public Optional<RankAccount> getUserRanking(String userUid) {
        return rankAccountRepository.findByUid(userUid);
    }

    /**
     * ✅ 특정 사용자 포인트 업데이트 (AI 분석 결과 반영)
     */
    @Transactional
    public void updateUserPoints(String userUid, int pointsChange) {
        Optional<RankAccount> userOpt = rankAccountRepository.findByUid(userUid);
        if (userOpt.isPresent()) {
            RankAccount user = userOpt.get();

            // ✅ 포인트 업데이트
            int newMonthlyPoints = user.getMonthlyPoints() + pointsChange;
            int newAccumulatedPoints = user.getAccumulatedPoints() + pointsChange;
            user.setMonthlyPoints(newMonthlyPoints);
            user.setAccumulatedPoints(newAccumulatedPoints);

            // ✅ 등급 정보 업데이트
            String newGrade = rankCalculatorService.getGrade(newAccumulatedPoints);
            int pointsToNextGrade = rankCalculatorService.getPointsNeededForNextGrade(newAccumulatedPoints);

            // ✅ 변경된 데이터 저장
            rankAccountRepository.save(user);

            // ✅ WebSocket을 통해 실시간 업데이트 전송
            Map<String, Object> updateData = Map.of(
                    "uid", user.getUid(),
                    "nickname", user.getNickname(),
                    "updatedMonthlyPoints", newMonthlyPoints,
                    "updatedAccumulatedPoints", newAccumulatedPoints,
                    "grade", newGrade,
                    "pointsToNextGrade", pointsToNextGrade
            );
            messagingTemplate.convertAndSend("/topic/user-updates", updateData);
        }
    }


    /**
     * ✅ 특정 아파트 내 랭킹 조회
     */
    public List<Map<String, Object>> getApartmentRankings(Long apartmentId) {
        return rankAccountRepository.findByApartmentId(apartmentId).stream().map(this::mapRankingData).toList();
    }

    public List<Map<String, Object>> getApartmentOrGlobalRankings(String apartmentId) {
        if (apartmentId == null || "all".equals(apartmentId)) {
            return getAllRankings();
        }
        return getApartmentRankings(Long.parseLong(apartmentId));
    }

    /**
     * ✅ 월별 획득 포인트 조회
     */
    public List<Map<String, Object>> getMonthlyPoints(String userUid) {
        return monthlyPointsRepository.findMonthlyPointsByUser(userUid).stream().map(this::mapMonthlyPointsData).toList();
    }

    /**
     * ✅ 특정 사용자의 위/아래 랭킹 찾기
     */
    public Map<String, Object> getAboveUser(Long apartmentId, String userUid) {
        List<Map<String, Object>> rankings = getApartmentRankings(apartmentId);
        int index = findUserIndex(rankings, userUid);
        return (index > 0) ? rankings.get(index - 1) : null;
    }

    public Map<String, Object> getBelowUser(Long apartmentId, String userUid) {
        List<Map<String, Object>> rankings = getApartmentRankings(apartmentId);
        int index = findUserIndex(rankings, userUid);
        return (index < rankings.size() - 1) ? rankings.get(index + 1) : null;
    }

    /**
     * ✅ 전체 랭킹 조회
     */
    public List<Map<String, Object>> getAllRankings() {
        return rankAccountRepository.findAllRankings().stream().map(this::mapRankingData).toList();
    }

    /**
     * ✅ 유저의 현재 랭킹을 찾아 인덱스 반환
     */
    private int findUserIndex(List<Map<String, Object>> rankings, String userUid) {
        for (int i = 0; i < rankings.size(); i++) {
            if (rankings.get(i).get("uid").equals(userUid)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * ✅ 랭킹 데이터 변환
     */
    private Map<String, Object> mapRankingData(Object[] data) {
        int ranking = ((Number) data[6]).intValue();
        int accumulatedPoints = ((Number) data[5]).intValue();

        String grade = rankCalculatorService.getGrade(accumulatedPoints);
        int pointsToNextGrade = rankCalculatorService.getPointsNeededForNextGrade(accumulatedPoints);

        return Map.of(
                "uid", data[0],
                "nickname", data[1],
                "apartmentId", data[2],
                "month", data[3],
                "monthlyPoints", data[4],
                "accumulatedPoints", accumulatedPoints,
                "ranking", ranking,
                "grade", grade,
                "pointsToNextGrade", pointsToNextGrade
        );
    }

    /**
     * ✅ 월별 포인트 데이터 변환
     */
    private Map<String, Object> mapMonthlyPointsData(Object[] data) {
        return Map.of("month", data[0], "totalPoints", data[1]);
    }
}