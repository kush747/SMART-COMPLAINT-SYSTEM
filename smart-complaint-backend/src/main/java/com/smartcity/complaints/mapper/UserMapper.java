package com.smartcity.complaints.mapper;

import com.smartcity.complaints.dto.UserResponse;
import com.smartcity.complaints.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getAddress(),
                user.isEnabled(),
                user.getCreatedAt()
        );
    }
}
