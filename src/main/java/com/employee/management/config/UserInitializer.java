package com.employee.management.config;

import com.employee.management.entity.User;
import com.employee.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .name("Admin User")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin / admin123");
        }
    }
}
