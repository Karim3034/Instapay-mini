package com.karim.instapay.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionSummaryDTO {
    private String username;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal totalSent;
    private BigDecimal totalReceived;
    private Long totalTransactions;
    private BigDecimal netBalance;
} 