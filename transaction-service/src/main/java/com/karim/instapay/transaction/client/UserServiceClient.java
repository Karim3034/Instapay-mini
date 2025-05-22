package com.karim.instapay.transaction.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.math.BigDecimal;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    @PutMapping("/api/users/{username}/balance")
    ResponseEntity<Void> updateBalance(
        @PathVariable("username") String username,
        @RequestParam("amount") BigDecimal amount
    );
}