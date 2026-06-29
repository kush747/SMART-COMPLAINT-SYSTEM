package com.smartcity.complaints.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RemarkRequest(@NotBlank @Size(max = 3000) String comment) {}
