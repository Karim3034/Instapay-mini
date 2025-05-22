package com.karim.instapay.reporting.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailDTO {
    private Long transactionId;
    private String senderUsername;
    private String receiverUsername;
    private BigDecimal amount;
    private String description;
    private LocalDateTime timestamp;
    private String status;
} 