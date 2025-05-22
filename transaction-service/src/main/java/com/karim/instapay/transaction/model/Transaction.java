package com.karim.instapay.transaction.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions")
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String senderUsername;

    @Column(nullable = false)
    private String receiverUsername;

    @Column(nullable = false)
    private BigDecimal amount;

    private String description;

    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;
    
    public enum TransactionStatus {
        PENDING,
        COMPLETED,
        FAILED
    }
    
    @Column(nullable = false)
    private Boolean successful = false;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type = TransactionType.TRANSFER;
    
    private String errorMessage;
}