package com.smartcity.complaints.dto;

import com.smartcity.complaints.entity.Role;

import java.time.Instant;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        String phone,
        String address,
        boolean enabled,
        Instant createdAt
) {}
