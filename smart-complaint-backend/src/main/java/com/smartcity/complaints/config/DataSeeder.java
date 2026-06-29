package com.smartcity.complaints.config;

import com.smartcity.complaints.entity.Role;
import com.smartcity.complaints.entity.User;
import com.smartcity.complaints.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:admin@smartcity.gov}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:Admin@12345}")
    private String adminPassword;

    @Bean
    CommandLineRunner seedAdmin() {
        return args -> {
            if (!userRepository.existsByEmail(adminEmail)) {
                userRepository.save(User.builder()
                        .fullName("System Administrator")
                        .email(adminEmail.toLowerCase())
                        .password(passwordEncoder.encode(adminPassword))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build());
            }
        };
    }
}
