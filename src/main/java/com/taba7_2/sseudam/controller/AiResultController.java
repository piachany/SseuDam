package com.taba7_2.sseudam.controller;

import com.taba7_2.sseudam.service.AiResultService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiResultController {

    private final AiResultService aiResultService;

    public AiResultController(AiResultService aiResultService) {
        this.aiResultService = aiResultService;
    }

    /**
     * ✅ AI 분석 결과를 가져오고, 평균 confidence 값을 라즈베리파이에 전송
     */
    @GetMapping("/process")
    public String processAiResultsAndSend() {
        aiResultService.processAiResultsAndSendToDisplay();
        return "✅ AI results processed and sent to Raspberry Pi!";
    }
}