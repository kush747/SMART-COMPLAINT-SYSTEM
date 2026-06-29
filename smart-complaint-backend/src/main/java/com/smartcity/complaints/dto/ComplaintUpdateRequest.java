package com.smartcity.complaints.dto;

import com.smartcity.complaints.entity.ComplaintCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ComplaintUpdateRequest(
        @NotBlank @Size(max = 160) String title,
        @NotBlank @Size(max = 5000) String description,
        @NotNull ComplaintCategory category,
        @NotBlank @Size(max = 255) String location,
        @Size(max = 500) String imageUrl
) {}
