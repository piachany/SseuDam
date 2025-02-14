package com.taba7_2.sseudam.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@Service
public class AiResultService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String AI_SERVER_URL = "http://localhost:8080/api/ai/results";
    private static final String RASPBERRY_PI_URL = "http://192.168.100.2:5000/display";

    /**
     * ✅ AI 서버에서 분석 결과를 가져오고, Flask 서버(라즈베리파이)로 성공률 전송
     */
    public void processAiResultsAndSendToDisplay() {
        try {
            // ✅ AI 서버에서 분석 결과 가져오기
            ResponseEntity<String> response = restTemplate.getForEntity(AI_SERVER_URL, String.class);
            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                System.err.println("Failed to fetch AI results: " + response.getStatusCode());
                return;
            }

            // ✅ JSON 파싱하여 confidence 값 추출
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            List<Double> confidenceValues = new ArrayList<>();
            for (JsonNode node : rootNode) {
                if (node.has("confidence")) {
                    confidenceValues.add(node.get("confidence").asDouble());
                }
            }

            if (confidenceValues.isEmpty()) {
                System.err.println("No confidence values found in AI results.");
                return;
            }

            // ✅ confidence 평균값 계산 (정수 변환)
            double averageConfidence = confidenceValues.stream()
                    .mapToDouble(Double::doubleValue)
                    .average()
                    .orElse(0.0);

            int roundedConfidence = (int) Math.round(averageConfidence * 100);
            System.out.println("✅ Calculated Success Rate: " + roundedConfidence);

            // ✅ 라즈베리파이로 전송
            sendSuccessRateToDisplay(roundedConfidence);

        } catch (Exception e) {
            System.err.println("❌ Error processing AI results: " + e.getMessage());
        }
    }

    /**
     * ✅ Flask 서버 (라즈베리파이)로 성공률 전송
     */
    private void sendSuccessRateToDisplay(int successRate) {
        try {
            // ✅ 요청 데이터 생성
            Map<String, Object> requestBody = Map.of("number", successRate); // 🔥 `success_rate` → `number`로 변경

            // ✅ HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // ✅ HTTP 요청 객체 생성
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            // ✅ Flask 서버로 POST 요청 보내기
            ResponseEntity<String> response = restTemplate.postForEntity(RASPBERRY_PI_URL, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("✅ Success rate sent to Raspberry Pi: " + successRate);
            } else {
                System.err.println("❌ Failed to send success rate: " + response.getStatusCode());
            }

        } catch (Exception e) {
            System.err.println("❌ Error sending success rate to Raspberry Pi: " + e.getMessage());
        }
    }
}