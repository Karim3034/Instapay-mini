package com.karim.instapay.user.service;

import com.karim.instapay.user.dto.LoginRequest;
import com.karim.instapay.user.dto.SignupRequest;
import com.karim.instapay.user.dto.UserDTO;
import com.karim.instapay.user.model.User;
import com.karim.instapay.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;   
     public UserDTO registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); 
        user.setFullName(request.getFullName());
        user.setBalance(request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.valueOf(100));

        return convertToDTO(userRepository.save(user));
    }

    public UserDTO loginUser(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getPassword() == null || !user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        UserDTO responseDTO = convertToDTO(user);
        responseDTO.setPassword(null); 
        return responseDTO;
    }

    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username is already in use!");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword()); 
        user.setFullName(userDTO.getFullName());
        user.setBalance(userDTO.getBalance() != null ? userDTO.getBalance() : BigDecimal.valueOf(100));

        User savedUser = userRepository.save(user);
        UserDTO responseDTO = convertToDTO(savedUser);
        responseDTO.setPassword(null); 
        return responseDTO;
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateUser(UserDTO userDTO) {
        User user = userRepository.findById(userDTO.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        updateUserFromDTO(user, userDTO);
        return convertToDTO(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setBalance(user.getBalance());
        // Don't set password in DTO for security
        return dto;
    }

    private void updateUserFromDTO(User user, UserDTO dto) {
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email is already in use!");
            }
            user.setEmail(dto.getEmail());
        }
        
        if (dto.getUsername() != null && !dto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(dto.getUsername())) {
                throw new RuntimeException("Username is already in use!");
            }
            user.setUsername(dto.getUsername());
        }
        
        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }
        
        if (dto.getBalance() != null) {
            user.setBalance(dto.getBalance());
        }
    }

    @Transactional
    public void updateBalance(String username, BigDecimal amount) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setBalance(user.getBalance().add(amount));
        userRepository.save(user);
    }

    @Transactional
    public UserDTO updateUserProfile(String email, String fullName, String newEmail) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }
        
        if (newEmail != null && !newEmail.isEmpty() && !newEmail.equals(email)) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new RuntimeException("Email is already in use!");
            }
            user.setEmail(newEmail);
        }
        
        return convertToDTO(userRepository.save(user));
    }
}