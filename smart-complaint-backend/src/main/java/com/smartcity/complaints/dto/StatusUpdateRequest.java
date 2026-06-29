package com.smartcity.complaints.dto;

import com.smartcity.complaints.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull ComplaintStatus status) {}
