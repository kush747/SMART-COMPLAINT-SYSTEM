package com.smartcity.complaints.service;

import com.smartcity.complaints.dto.ComplaintResponse;
import com.smartcity.complaints.dto.DashboardDtos;
import com.smartcity.complaints.entity.*;
import com.smartcity.complaints.mapper.ComplaintMapper;
import com.smartcity.complaints.repository.ComplaintRepository;
import com.smartcity.complaints.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ComplaintMapper complaintMapper;

    public DashboardDtos.UserDashboard userDashboard(Authentication authentication) {
        User user = userService.currentUser(authentication);
        return new DashboardDtos.UserDashboard(
                complaintRepository.countByCreatedBy(user),
                complaintRepository.countByCreatedByAndStatus(user, ComplaintStatus.PENDING),
                complaintRepository.countByCreatedByAndStatus(user, ComplaintStatus.RESOLVED),
                complaintRepository.countByCreatedByAndStatus(user, ComplaintStatus.REJECTED)
        );
    }

    public DashboardDtos.OfficerDashboard officerDashboard(Authentication authentication) {
        User officer = userService.currentUser(authentication);
        List<ComplaintResponse> recent = complaintRepository.findByAssignedOfficer(
                        officer, PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .map(complaint -> complaintMapper.toResponse(complaint, officer))
                .toList();
        return new DashboardDtos.OfficerDashboard(
                complaintRepository.countByAssignedOfficer(officer),
                complaintRepository.countByAssignedOfficerAndStatus(officer, ComplaintStatus.PENDING)
                        + complaintRepository.countByAssignedOfficerAndStatus(officer, ComplaintStatus.ASSIGNED)
                        + complaintRepository.countByAssignedOfficerAndStatus(officer, ComplaintStatus.IN_PROGRESS),
                complaintRepository.countByAssignedOfficerAndStatus(officer, ComplaintStatus.RESOLVED),
                recent
        );
    }

    public DashboardDtos.AdminDashboard adminDashboard() {
        Map<ComplaintCategory, Long> byCategory = new EnumMap<>(ComplaintCategory.class);
        Arrays.stream(ComplaintCategory.values()).forEach(category ->
                byCategory.put(category, complaintRepository.countByCategory(category)));

        Map<ComplaintStatus, Long> byStatus = new EnumMap<>(ComplaintStatus.class);
        Arrays.stream(ComplaintStatus.values()).forEach(status ->
                byStatus.put(status, complaintRepository.countByStatus(status)));

        List<DashboardDtos.MonthlyComplaintStat> monthly = complaintRepository.monthlyStats(Instant.now().minus(365, ChronoUnit.DAYS))
                .stream()
                .map(row -> new DashboardDtos.MonthlyComplaintStat(((Number) row[0]).intValue(), ((Number) row[1]).intValue(), ((Number) row[2]).longValue()))
                .toList();

        return new DashboardDtos.AdminDashboard(
                userRepository.countByRole(Role.USER),
                userRepository.countByRole(Role.OFFICER),
                complaintRepository.count(),
                byCategory,
                byStatus,
                monthly
        );
    }
}
