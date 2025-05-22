package com.karim.instapay.reporting.service;

import com.karim.instapay.reporting.dto.TransactionSummaryDTO;
import com.karim.instapay.reporting.dto.UserActivityDTO;

import java.time.LocalDateTime;

public interface ReportingService {
    TransactionSummaryDTO getUserTransactionSummary(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    UserActivityDTO getUserActivity(Long userId, LocalDateTime startDate, LocalDateTime endDate);
} 