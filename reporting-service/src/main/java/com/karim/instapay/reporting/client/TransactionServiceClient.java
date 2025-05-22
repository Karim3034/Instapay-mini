package com.karim.instapay.reporting.client;

import com.karim.instapay.reporting.dto.TransactionDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "transaction-service")
public interface TransactionServiceClient {
    @GetMapping("/api/transactions/user/{username}")
    List<TransactionDTO> getUserTransactions(@PathVariable("username") String username);
} 