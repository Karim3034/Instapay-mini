package com.karim.instapay.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String username;
    
    private String password;
    private String fullName;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;
}
