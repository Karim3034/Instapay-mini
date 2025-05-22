package com.karim.instapay.reporting.service;

import com.karim.instapay.reporting.client.TransactionServiceClient;
import com.karim.instapay.reporting.client.UserServiceClient;
import com.karim.instapay.reporting.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportingServiceImpl implements ReportingService {

    private final TransactionServiceClient transactionServiceClient;
    private final UserServiceClient userServiceClient;

    @Override
    public TransactionSummaryDTO getUserTransactionSummary(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        String username = userServiceClient.getUserById(userId).getUsername();
        List<TransactionDTO> transactions = transactionServiceClient.getUserTransactions(username);
        
        List<TransactionDTO> filteredTransactions = transactions.stream()
            .filter(t -> t.getTimestamp().isAfter(startDate) && t.getTimestamp().isBefore(endDate))
            .filter(t -> "COMPLETED".equals(t.getStatus()))
            .collect(Collectors.toList());

        BigDecimal totalSent = filteredTransactions.stream()
            .filter(t -> t.getSenderUsername().equals(username))
            .map(TransactionDTO::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalReceived = filteredTransactions.stream()
            .filter(t -> t.getReceiverUsername().equals(username))
            .map(TransactionDTO::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TransactionSummaryDTO(
            username,
            startDate,
            endDate,
            totalSent,
            totalReceived,
            (long) filteredTransactions.size(),
            totalReceived.subtract(totalSent)
        );
    }

    @Override
    public UserActivityDTO getUserActivity(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        String username = userServiceClient.getUserById(userId).getUsername();
        List<TransactionDTO> allTransactions = transactionServiceClient.getUserTransactions(username);
        
        List<TransactionDTO> filteredTransactions = allTransactions.stream()
            .filter(t -> t.getTimestamp().isAfter(startDate) && t.getTimestamp().isBefore(endDate))
            .collect(Collectors.toList());

        List<TransactionDetailDTO> details = filteredTransactions.stream()
            .map(t -> new TransactionDetailDTO(
                t.getId(),
                t.getSenderUsername(),
                t.getReceiverUsername(),
                t.getAmount(),
                t.getDescription(),
                t.getTimestamp(),
                t.getStatus()
            ))
            .collect(Collectors.toList());

        BigDecimal currentBalance = calculateCurrentBalance(username, allTransactions);

        return new UserActivityDTO(
            username,
            startDate,
            endDate,
            details,
            currentBalance
        );
    }

    private BigDecimal calculateCurrentBalance(String username, List<TransactionDTO> transactions) {
        return transactions.stream()
            .filter(t -> "COMPLETED".equals(t.getStatus()))
            .map(t -> {
                if (t.getSenderUsername().equals(username)) {
                    return t.getAmount().negate();
                } else if (t.getReceiverUsername().equals(username)) {
                    return t.getAmount();
                }
                return BigDecimal.ZERO;
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
} 