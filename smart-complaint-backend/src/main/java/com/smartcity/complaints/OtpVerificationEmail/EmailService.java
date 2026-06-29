package com.smartcity.complaints.OtpVerificationEmail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("SmartCity - Email Verification");
        message.setText("Your verification code is:" + otp + "\n\nthis code will expire in 10 minutes.\n\n Do not share with anyone");
        mailSender.send(message);
    }

}
