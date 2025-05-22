package com.karim.instapay.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityDTO {
    private String username;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<TransactionDTO> transactions;
    private BigDecimal currentBalance;
} 