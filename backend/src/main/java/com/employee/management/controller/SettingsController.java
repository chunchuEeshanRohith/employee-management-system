package com.employee.management.controller;

import com.employee.management.dto.ChangePasswordDTO;
import com.employee.management.dto.UserProfileDTO;
import com.employee.management.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<UserProfileDTO> getSettings(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(settingsService.getUserProfile(username));
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, String>> updateSettings(
            @RequestBody UserProfileDTO dto,
            Authentication authentication) {
        String username = authentication.getName();
        settingsService.updateUserProfile(username, dto);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody ChangePasswordDTO dto,
            Authentication authentication) {
        String username = authentication.getName();
        try {
            settingsService.changePassword(username, dto);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
