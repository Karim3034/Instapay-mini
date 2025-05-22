package com.karim.instapay.reporting.controller;

import com.karim.instapay.reporting.dto.TransactionSummaryDTO;
import com.karim.instapay.reporting.dto.UserActivityDTO;
import com.karim.instapay.reporting.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService reportingService;

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<TransactionSummaryDTO> getUserTransactionSummary(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(reportingService.getUserTransactionSummary(userId, startDate, endDate));
    }

    @GetMapping("/user/{userId}/activity")
    public ResponseEntity<UserActivityDTO> getUserActivity(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(reportingService.getUserActivity(userId, startDate, endDate));
    }
} 