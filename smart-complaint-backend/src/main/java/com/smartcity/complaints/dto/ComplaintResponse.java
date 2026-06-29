package com.smartcity.complaints.dto;

import com.smartcity.complaints.entity.ComplaintCategory;
import com.smartcity.complaints.entity.ComplaintStatus;

import java.time.Instant;
import java.util.List;

public record ComplaintResponse(
        Long id,
        String title,
        String description,
        ComplaintCategory category,
        ComplaintStatus status,
        String location,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt,
        UserResponse createdBy,
        UserResponse assignedOfficer,
        long supportCount,
        boolean supportedByCurrentUser,
        List<RemarkResponse> remarks
) {}
