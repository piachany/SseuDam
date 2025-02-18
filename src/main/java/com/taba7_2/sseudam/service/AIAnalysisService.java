package com.taba7_2.sseudam.service;

import com.taba7_2.sseudam.repository.AIAnalysisResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIAnalysisService {

    private final AIAnalysisResultRepository aiAnalysisResultRepository;

    @Autowired
    public AIAnalysisService(AIAnalysisResultRepository aiAnalysisResultRepository) {
        this.aiAnalysisResultRepository = aiAnalysisResultRepository;
    }

    /**
     * ✅ 사용자 최근 6일 분석 결과 조회
     */
    public List<Map<String, Object>> getRecentAnalysisResults(String uid) {
        return aiAnalysisResultRepository.findRecentAnalysisResults(uid);
    }

    /**
     * ✅ 사용자 월별 재질별 평균 성공률 조회
     */
    public Map<String, List<Map<String, Object>>> getMonthlyMaterialSuccessRates(String uid) {
        List<Object[]> results = aiAnalysisResultRepository.findMonthlyMaterialSuccessByUser(uid);
        Map<String, List<Map<String, Object>>> groupedByMonth = new LinkedHashMap<>();

        for (Object[] row : results) {
            String month = (String) row[0];
            if (month == null || month.isEmpty()) continue;

            String material = (String) row[1];
            Double avgSuccess = ((Number) row[2]).doubleValue();

            groupedByMonth.putIfAbsent(month, new ArrayList<>());
            groupedByMonth.get(month).add(Map.of(
                    "material", material,
                    "avg_success", avgSuccess
            ));
        }
        return groupedByMonth;
    }

    /**
     * ✅ 사용자 최근 5개월 평균 성공률 조회
     */
    public Map<String, Double> getUserMonthlyAvgSuccess(String uid) {
        List<Object[]> results = aiAnalysisResultRepository.findUserMonthlyAvgSuccess(uid);
        Map<String, Double> monthlyAvgSuccess = new LinkedHashMap<>();  // 월별 정렬 유지

        for (Object[] row : results) {
            String month = row[0].toString(); // YYYYMM 형식으로 변환
            Double avgSuccess = ((Number) row[1]).doubleValue(); // 🔥 BigDecimal → Double 변환 추가
            monthlyAvgSuccess.put(month, avgSuccess);
        }

        return monthlyAvgSuccess;
    }

    /**
     * ✅ 아파트 최근 5개월 평균 성공률 조회
     */
    public Map<String, Double> getApartmentMonthlyAvgSuccess(Long apartmentId) {
        List<Object[]> results = aiAnalysisResultRepository.findApartmentMonthlyAvgSuccess(apartmentId);
        Map<String, Double> monthlyAvgSuccess = new LinkedHashMap<>();

        for (Object[] row : results) {
            String month = row[0].toString(); // YYYYMM 형식 변환
            Double avgSuccess = ((Number) row[1]).doubleValue(); // 🔥 BigDecimal → Double 변환 추가
            monthlyAvgSuccess.put(month, avgSuccess);
        }

        return monthlyAvgSuccess;
    }
}