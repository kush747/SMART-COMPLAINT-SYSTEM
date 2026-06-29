package com.smartcity.complaints.service;

import com.smartcity.complaints.dto.ApiResponse;
import com.smartcity.complaints.dto.AuthDtos;
import com.smartcity.complaints.dto.AuthDtos.AuthResponse;
import com.smartcity.complaints.dto.UserResponse;
import com.smartcity.complaints.entity.Role;
import com.smartcity.complaints.entity.User;
import com.smartcity.complaints.exception.BadRequestException;
import com.smartcity.complaints.mapper.UserMapper;
import com.smartcity.complaints.repository.UserRepository;
import com.smartcity.complaints.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.smartcity.complaints.OtpVerificationEmail.OtpService;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final OtpService otpService;

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered");
        }
        if (request.role() == Role.ADMIN) {
            throw new BadRequestException("Admin accounts must be created by an administrator");
        }
        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .phone(request.phone())
                .address(request.address())
                .enabled(false)
                .build();
        userRepository.save(user);
        otpService.generateAndSendOtp(user);
        // return buildAuthResponse(user);
        return new AuthDtos.AuthResponse(null, null, null);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password()));
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        return buildAuthResponse(user);
    }

    private AuthDtos.AuthResponse buildAuthResponse(User user) {
        UserResponse response = userMapper.toResponse(user);
        String token = jwtService.generateToken(user, Map.of("role", user.getRole().name(), "userId", user.getId()));
        return new AuthDtos.AuthResponse(token, "Bearer", response);
    }

    // public AuthDtos.ResetPasswordResponse
    // resetPassword(AuthDtos.ResetPasswordRequest request) {
    // if (!request.password().equals(request.confirmPassword())) {
    // throw new BadRequestException("Passwords do not match");
    // }
    // User user = userRepository.findByEmail(request.email().toLowerCase())
    // .orElseThrow(() -> new BadRequestException("User not found"));
    // user.setPassword(passwordEncoder.encode(request.password()));
    // userRepository.save(user);
    // return new AuthDtos.ResetPasswordResponse("Password reset successfully",
    // userMapper.toResponse(user));
    // }

    @Transactional
    public void verifyEmail(String email, String otp) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (user.isEnabled()) {
            throw new BadRequestException("User is already verified");
        }
        if (!otpService.verifyOtp(user, otp)) {
            throw new BadRequestException("Invalid OTP");
        }
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userRepository.save(user);

    }

    @Transactional
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));
        if (user.isEnabled()) {
            throw new BadRequestException("User is already verified");
        }
        otpService.generateAndSendOtp(user);

    }
     
    @Transactional
    public void forgotPassword(String email){

        User user = userRepository.findByEmail(email.toLowerCase())
        .orElseThrow(() -> new BadRequestException("User not found with email"+email));

        if(!user.isEnabled()){
            throw new BadRequestException("User is not verified, Please verify your email first");
        }
        otpService.generateAndSendOtp(user);
    }

    public void verifyResetOtp(String email,String otp){
        User user = userRepository.findByEmail(email.toLowerCase())
        .orElseThrow(() -> new BadRequestException("User not found"));

        if(!otpService.verifyOtp(user, otp)){
            throw new BadRequestException("Invalid OTP");
        }
        // user.setVerificationCode(null);
        // user.setVerificationCodeExpiry(null);
        // userRepository.save(user);
    }

    public void resetPassword(String email,String password,String confirmPassword,String otp){
       if(!password.equals(confirmPassword)){
        throw new BadRequestException("Passwords do not match");
       }
       User user = userRepository.findByEmail(email.toLowerCase())
       .orElseThrow(() -> new BadRequestException("User not found"));
       if(!otpService.verifyOtp(user, otp)){
        throw new BadRequestException("Invalid OTP");
       }
       user.setPassword(passwordEncoder.encode(password));
       user.setVerificationCode(null);
       user.setVerificationCodeExpiry(null);
       userRepository.save(user);
    }
}
