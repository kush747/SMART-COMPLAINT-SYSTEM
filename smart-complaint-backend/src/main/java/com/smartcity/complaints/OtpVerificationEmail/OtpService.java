package com.smartcity.complaints.OtpVerificationEmail;

import java.security.SecureRandom;
import java.time.Instant;

import org.springframework.stereotype.Service;

import com.smartcity.complaints.entity.User;
import com.smartcity.complaints.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    private static final int OTP_EXPIRY_MINUTE = 10;

    public void generateAndSendOtp(User user) {
        String otp = String.format("%06d", new SecureRandom().nextInt(999999));
        user.setVerificationCode(otp);
        user.setVerificationCodeExpiry(Instant.now().plusSeconds(OTP_EXPIRY_MINUTE * 60));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), otp);
    }

    public boolean verifyOtp(User user, String otp) {
        if (user.getVerificationCode() == null || user.getVerificationCodeExpiry() == null) {
            return false;
        }
        if(Instant.now().isAfter(user.getVerificationCodeExpiry())){
            return false;
        }
        return user.getVerificationCode().equals(otp);
       
    }

}
