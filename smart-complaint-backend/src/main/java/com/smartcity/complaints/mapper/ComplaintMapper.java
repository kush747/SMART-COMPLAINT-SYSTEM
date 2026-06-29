package com.smartcity.complaints.mapper;

import com.smartcity.complaints.dto.ComplaintResponse;
import com.smartcity.complaints.dto.RemarkResponse;
import com.smartcity.complaints.entity.Complaint;
import com.smartcity.complaints.entity.Remark;
import com.smartcity.complaints.entity.User;
import com.smartcity.complaints.repository.ComplaintSupportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;

@Component
@RequiredArgsConstructor
public class ComplaintMapper {
    private final UserMapper userMapper;
    private final ComplaintSupportRepository supportRepository;

    public ComplaintResponse toResponse(Complaint complaint, User currentUser) {
        boolean supported = currentUser != null && supportRepository.existsByComplaintAndUser(complaint, currentUser);
        return new ComplaintResponse(
                complaint.getId(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getCategory(),
                complaint.getStatus(),
                complaint.getLocation(),
                complaint.getImageUrl(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                userMapper.toResponse(complaint.getCreatedBy()),
                userMapper.toResponse(complaint.getAssignedOfficer()),
                supportRepository.countByComplaint(complaint),
                supported,
                complaint.getRemarks().stream()
                        .sorted(Comparator.comparing(Remark::getCreatedAt).reversed())
                        .map(this::toRemarkResponse)
                        .toList()
        );
    }

    public RemarkResponse toRemarkResponse(Remark remark) {
        return new RemarkResponse(
                remark.getId(),
                remark.getComplaint().getId(),
                userMapper.toResponse(remark.getOfficer()),
                remark.getComment(),
                remark.getCreatedAt()
        );
    }
}
