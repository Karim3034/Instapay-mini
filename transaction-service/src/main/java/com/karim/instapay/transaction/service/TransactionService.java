package com.karim.instapay.transaction.service;

import com.karim.instapay.transaction.client.UserServiceClient;
import com.karim.instapay.transaction.dto.TransactionDTO;
import com.karim.instapay.transaction.dto.TransferRequestDTO;
import com.karim.instapay.transaction.model.Transaction;
import com.karim.instapay.transaction.model.TransactionType;
import com.karim.instapay.transaction.model.Transaction.TransactionStatus;
import com.karim.instapay.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserServiceClient userServiceClient;

    @Transactional
    public TransactionDTO processTransfer(String senderUsername, TransferRequestDTO request) {
        validateTransferRequest(senderUsername, request);

        Transaction transaction = new Transaction();
        transaction.setSenderUsername(senderUsername);
        transaction.setReceiverUsername(request.getToUsername());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setType(TransactionType.TRANSFER);
        transaction.setSuccessful(false);

        try {
            transaction = transactionRepository.save(transaction);
            
            userServiceClient.updateBalance(senderUsername, request.getAmount().negate());
            userServiceClient.updateBalance(request.getToUsername(), request.getAmount());
            
            transaction.setStatus(TransactionStatus.COMPLETED);
            transaction.setSuccessful(true);
            transaction = transactionRepository.save(transaction);
            
            return convertToDTO(transaction);
        } catch (Exception e) {
            transaction.setStatus(TransactionStatus.FAILED);
            transaction.setSuccessful(false);
            transaction.setErrorMessage(e.getMessage());
            transactionRepository.save(transaction);
            throw new RuntimeException("Transfer failed: " + e.getMessage(), e);
        }
    }

    public List<TransactionDTO> getUserTransactions(String username) {
        List<Transaction> transactions = transactionRepository
            .findBySenderUsernameOrReceiverUsername(username, username);
        return transactions.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public TransactionDTO getTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return convertToDTO(transaction);
    }

    private void validateTransferRequest(String senderUsername, TransferRequestDTO request) {
        if (request.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        if (senderUsername.equals(request.getToUsername())) {
            throw new IllegalArgumentException("Cannot transfer money to yourself");
        }
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setSenderUsername(transaction.getSenderUsername());
        dto.setReceiverUsername(transaction.getReceiverUsername());
        dto.setAmount(transaction.getAmount());
        dto.setDescription(transaction.getDescription());
        dto.setTimestamp(transaction.getTimestamp());
        dto.setStatus(transaction.getStatus());
        return dto;
    }
} 