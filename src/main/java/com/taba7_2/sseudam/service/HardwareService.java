package com.taba7_2.sseudam.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class HardwareService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String RASPBERRY_PI_URL = "http://192.168.100.8:5000/display";

    public int fetchSuccessRate(String category) {
        return (int) (Math.random() * 100); // 실제 데이터베이스에서 성공률을 가져오도록 변경 가능
    }

    public void sendSuccessRateToRaspberryPi(int successRate) {
        try {
            Map<String, Object> requestBody = Map.of("number", successRate);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(RASPBERRY_PI_URL, requestEntity, String.class);
            if (response.getStatusCode() != HttpStatus.OK) {
                System.err.println("❌ Failed to send success rate: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("❌ Error sending success rate: " + e.getMessage());
        }
    }
}