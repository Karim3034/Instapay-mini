package com.karim.instapay.transaction.repository;

import com.karim.instapay.transaction.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderUsernameOrReceiverUsername(String senderUsername, String receiverUsername);
}