package com.smartcity.complaints.dto;

import com.smartcity.complaints.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(
            @NotBlank @Size(max = 120) 
            String fullName,
            @NotBlank @Email @Size(max = 160) 
            String email,
            @NotBlank @Size(min = 8, max = 100) 
            String password,
            @NotNull 
            Role role,
            @Size(max = 30) 
            String phone,
            @Size(max = 255) 
            String address
    ) {}

    public record LoginRequest(
            @NotBlank @Email 
            String email,
            @NotBlank 
            String password
    ) {}

    public record AuthResponse(
            String token,
            String tokenType,
            UserResponse user
    ) {}

    public record ResetPasswordResponse(
            String message,
            UserResponse user
    ) {}
    public record VerifyOtpRequest(
            @Email
            String email,
            @NotBlank
            String otp
    ) {}
    public record ResendOtpRequest(
        String email
    )
    {}

    public record ForgotPasswordRequest(
        @Email
        @NotBlank
        String email
    )
    {}
    public record VerifyResetOtpRequest(
        @NotBlank
        @Email
        String email,
        @NotBlank
        String otp
    )
    {}
    public record ResetPasswordRequest(
        @Email
        @NotBlank
        String email,
        String otp,
        @NotBlank
        @Size(min = 8, max = 100)
        String password,
        @NotBlank
        @Size(min = 8, max = 100)
        String confirmPassword
    )
    {}
      

    
}
