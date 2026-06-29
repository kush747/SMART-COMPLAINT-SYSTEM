package com.smartcity.complaints.dto;

import java.time.Instant;

public record RemarkResponse(
        Long id,
        Long complaintId,
        UserResponse officer,
        String comment,
        Instant createdAt
) {}
