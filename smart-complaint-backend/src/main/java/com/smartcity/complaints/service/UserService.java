package com.smartcity.complaints.service;

import com.smartcity.complaints.dto.UserCreateRequest;
import com.smartcity.complaints.dto.UserResponse;
import com.smartcity.complaints.dto.UserUpdateRequest;
import com.smartcity.complaints.entity.Role;
import com.smartcity.complaints.entity.User;
import com.smartcity.complaints.exception.BadRequestException;
import com.smartcity.complaints.exception.ResourceNotFoundException;
import com.smartcity.complaints.mapper.UserMapper;
import com.smartcity.complaints.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public User currentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    public Page<UserResponse> list(Role role, String search, Pageable pageable) {
        Page<User> users;
        if (role != null) {
            users = userRepository.findByRole(role, pageable);
        } else if (search != null && !search.isBlank()) {
            users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(userMapper::toResponse);
    }

    public UserResponse get(Long id) {
        return userMapper.toResponse(findById(id));
    }

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered");
        }
        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .phone(request.phone())
                .address(request.address())
                .enabled(request.enabled())
                .build();
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        User user = findById(id);
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setEnabled(request.enabled());
        return userMapper.toResponse(user);
    }

    @Transactional
    public void delete(Long id) {
        userRepository.delete(findById(id));
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    public List<UserResponse> getAllOfficers(Pageable pageable) {
    return userRepository.findByRole(Role.OFFICER,pageable)
            .stream()
            .map(userMapper::toResponse)
            .toList();
}
}
