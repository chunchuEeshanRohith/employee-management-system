package com.employee.management.service;

import com.employee.management.dto.ChangePasswordDTO;
import com.employee.management.dto.UserProfileDTO;
import com.employee.management.entity.User;
import com.employee.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileDTO getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserProfileDTO(
                user.getName(),
                user.getEmail(),
                user.getTheme() == null ? "light" : user.getTheme(),
                user.getNotificationsEnabled()
        );
    }

    public void updateUserProfile(String username, UserProfileDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setTheme(dto.getTheme());
        user.setNotificationsEnabled(dto.getNotificationsEnabled() != null ? dto.getNotificationsEnabled() : true);
        userRepository.save(user);
    }

    public void changePassword(String username, ChangePasswordDTO dto) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect old password");
        }
        
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}
