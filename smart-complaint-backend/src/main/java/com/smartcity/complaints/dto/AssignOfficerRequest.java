package com.smartcity.complaints.dto;

import jakarta.validation.constraints.NotNull;

public record AssignOfficerRequest(@NotNull Long officerId) {}
