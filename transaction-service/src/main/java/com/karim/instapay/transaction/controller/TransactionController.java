package com.karim.instapay.transaction.controller;

import com.karim.instapay.transaction.dto.TransactionDTO;
import com.karim.instapay.transaction.dto.TransferRequestDTO;
import com.karim.instapay.transaction.service.TransactionService;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin

public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO> transferMoney(
            @Valid @RequestBody TransferRequestDTO request) {
        return ResponseEntity.ok(transactionService.processTransfer(request.getSenderUsername(), request));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<TransactionDTO>> getUserTransactions(
            @PathVariable String username) {
        return ResponseEntity.ok(transactionService.getUserTransactions(username));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionDTO> getTransaction(
            @PathVariable Long transactionId) {
        return ResponseEntity.ok(transactionService.getTransactionById(transactionId));
    }
}
