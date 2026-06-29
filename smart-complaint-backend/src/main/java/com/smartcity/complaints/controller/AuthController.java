package com.smartcity.complaints.controller;

import com.smartcity.complaints.dto.ApiResponse;
import com.smartcity.complaints.dto.AuthDtos;
import com.smartcity.complaints.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthDtos.AuthResponse> register(
            @Valid @RequestBody AuthDtos.RegisterRequest request) {
        return ApiResponse.ok("Registered successfully", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthDtos.AuthResponse> login(
            @Valid @RequestBody AuthDtos.LoginRequest request) {
        return ApiResponse.ok("Logged in successfully", authService.login(request));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.ok("Logout successful. Remove the token on the client.", null);
    }
    // @PostMapping("/reset-password")
    // public ApiResponse<AuthDtos.ResetPasswordResponse> resetPassword(
    // @Valid @RequestBody AuthDtos.ResetPasswordRequest request
    // ) {
    // return ApiResponse.ok("Password reset successfully",
    // authService.resetPassword(request));
    // }

    @PostMapping("/verify")
    public ApiResponse<Void> verify(
            @RequestBody AuthDtos.VerifyOtpRequest request) {
        authService.verifyEmail(request.email(), request.otp());
        return ApiResponse.ok("Email Verified successfully", null);

    }

    @PostMapping("/resend-otp")
    public ApiResponse<Void> resendOtp(
            @RequestBody AuthDtos.ResendOtpRequest request) {
        authService.resendOtp(request.email());
        return ApiResponse.ok("OTP Resent successfully", null);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(
            @RequestBody AuthDtos.ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ApiResponse.ok("OTP sent successfully", null);
    }

    @PostMapping("/verify-reset-otp")
    public ApiResponse<Void> verifyResetOtp(
            @RequestBody AuthDtos.VerifyResetOtpRequest request) {
        authService.verifyResetOtp(request.email(), request.otp());
        return ApiResponse.ok("OTP Verified successfully", null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(
            @RequestBody AuthDtos.ResetPasswordRequest request) {
        authService.resetPassword(request.email(), request.password(), request.confirmPassword(), request.otp());
        return ApiResponse.ok("Password reset successfully", null);
    }
}
