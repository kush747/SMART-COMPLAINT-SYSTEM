package com.smartcity.complaints.controller;

import com.smartcity.complaints.dto.ApiResponse;
import com.smartcity.complaints.dto.DashboardDtos;
import com.smartcity.complaints.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboards")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user")
    public ApiResponse<DashboardDtos.UserDashboard> user(Authentication authentication) {
        return ApiResponse.ok("User dashboard fetched", dashboardService.userDashboard(authentication));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/officer")
    public ApiResponse<DashboardDtos.OfficerDashboard> officer(Authentication authentication) {
        return ApiResponse.ok("Officer dashboard fetched", dashboardService.officerDashboard(authentication));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ApiResponse<DashboardDtos.AdminDashboard> admin() {
        return ApiResponse.ok("Admin dashboard fetched", dashboardService.adminDashboard());
    }
}
