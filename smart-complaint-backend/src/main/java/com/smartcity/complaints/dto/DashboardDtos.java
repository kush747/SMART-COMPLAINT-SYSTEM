package com.smartcity.complaints.dto;

import com.smartcity.complaints.entity.ComplaintCategory;
import com.smartcity.complaints.entity.ComplaintStatus;

import java.util.List;
import java.util.Map;

public final class DashboardDtos {
    private DashboardDtos() {}

    public record UserDashboard(long totalComplaints, long pendingComplaints, long resolvedComplaints, long rejectedComplaints) {}

    public record OfficerDashboard(long assignedComplaints, long pendingComplaints, long resolvedComplaints, List<ComplaintResponse> recentComplaints) {}

    public record AdminDashboard(
            long totalUsers,
            long totalOfficers,
            long totalComplaints,
            Map<ComplaintCategory, Long> complaintsByCategory,
            Map<ComplaintStatus, Long> complaintsByStatus,
            List<MonthlyComplaintStat> monthlyComplaintStatistics
    ) {}

    public record MonthlyComplaintStat(int year, int month, long total) {}
}
