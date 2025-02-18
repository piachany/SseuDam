package com.taba7_2.sseudam.controller;

import com.taba7_2.sseudam.service.HardwareService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/hardware")
public class HardwareController {

    private final HardwareService hardwareService;

    public HardwareController(HardwareService hardwareService) {
        this.hardwareService = hardwareService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendToHardware(@RequestParam String selectedCategory) {
        int successRate = hardwareService.fetchSuccessRate(selectedCategory);
        hardwareService.sendSuccessRateToRaspberryPi(successRate);
        return ResponseEntity.ok(Map.of("message", "✅ Success rate sent to Raspberry Pi", "successRate", successRate));
    }
}