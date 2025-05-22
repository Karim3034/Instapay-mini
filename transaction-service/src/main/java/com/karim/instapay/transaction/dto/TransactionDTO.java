package com.karim.instapay.transaction.dto;

import com.karim.instapay.transaction.model.Transaction.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private String senderUsername;
    private String receiverUsername;
    private BigDecimal amount;
    private String description;
    private LocalDateTime timestamp;
    private TransactionStatus status;
} 