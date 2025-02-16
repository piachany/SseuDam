package com.taba7_2.sseudam.service;

import com.taba7_2.sseudam.model.RankAccount;
import com.taba7_2.sseudam.repository.MonthlyPointsRepository;
import com.taba7_2.sseudam.repository.RankAccountRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class RankingService {
    private final RankAccountRepository rankAccountRepository;
    private final MonthlyPointsRepository monthlyPointsRepository;

    public RankingService(RankAccountRepository rankAccountRepository, MonthlyPointsRepository monthlyPointsRepository) {
        this.rankAccountRepository = rankAccountRepository;
        this.monthlyPointsRepository = monthlyPointsRepository;
    }

    public Optional<RankAccount> getUserRanking(String userUid) {
        return rankAccountRepository.findByUid(userUid);
    }

    public List<Map<String, Object>> getTop3Rankings(int month) {
        return rankAccountRepository.findTop3ByMonth(month).stream().map(this::mapRankingData).toList();
    }

    public List<Map<String, Object>> getApartmentRankings(Long apartmentId, int month) {
        return rankAccountRepository.findByApartmentIdAndMonth(apartmentId, month).stream().map(this::mapRankingData).toList();
    }

    public List<Map<String, Object>> getMonthlyPoints(String userUid) {
        return monthlyPointsRepository.findMonthlyPointsByUser(userUid).stream().map(this::mapMonthlyPointsData).toList();
    }

    public Map<String, Object> getAboveUser(Long apartmentId, int month, String userUid) {
        List<Map<String, Object>> rankings = getApartmentRankings(apartmentId, month);
        int index = findUserIndex(rankings, userUid);
        return (index > 0) ? rankings.get(index - 1) : null;
    }

    public Map<String, Object> getBelowUser(Long apartmentId, int month, String userUid) {
        List<Map<String, Object>> rankings = getApartmentRankings(apartmentId, month);
        int index = findUserIndex(rankings, userUid);
        return (index < rankings.size() - 1) ? rankings.get(index + 1) : null;
    }

    private int findUserIndex(List<Map<String, Object>> rankings, String userUid) {
        for (int i = 0; i < rankings.size(); i++) {
            if (rankings.get(i).get("uid").equals(userUid)) {
                return i;
            }
        }
        return -1;
    }

    private Map<String, Object> mapRankingData(Object[] data) {
        return Map.of("uid", data[0], "nickname", data[1], "apartmentId", data[2], "month", data[3], "monthlyPoints", data[4], "accumulatedPoints", data[5], "ranking", data[6]);
    }

    private Map<String, Object> mapMonthlyPointsData(Object[] data) {
        return Map.of("month", data[0], "totalPoints", data[1]);
    }
}