package com.karim.instapay.reporting.client;

import com.karim.instapay.reporting.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    @GetMapping("/api/users/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);
} 