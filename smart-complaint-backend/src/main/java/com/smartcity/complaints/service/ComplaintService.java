package com.smartcity.complaints.service;

import com.smartcity.complaints.dto.*;
import com.smartcity.complaints.entity.*;
import com.smartcity.complaints.exception.BadRequestException;
import com.smartcity.complaints.exception.ForbiddenActionException;
import com.smartcity.complaints.exception.ResourceNotFoundException;
import com.smartcity.complaints.mapper.ComplaintMapper;
import com.smartcity.complaints.repository.ComplaintRepository;
import com.smartcity.complaints.repository.ComplaintSupportRepository;
import com.smartcity.complaints.repository.RemarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final ComplaintSupportRepository supportRepository;
    private final RemarkRepository remarkRepository;
    private final UserService userService;
    private final ComplaintMapper complaintMapper;

    public Page<ComplaintResponse> search(ComplaintStatus status, ComplaintCategory category, String location,
            String search, Pageable pageable, Authentication authentication) {
        User current = userService.currentUser(authentication);
        return complaintRepository.search(status, category, blankToNull(location), blankToNull(search), pageable)
                .map(complaint -> complaintMapper.toResponse(complaint, current));
    }

    public Page<ComplaintResponse> myComplaints(Pageable pageable, Authentication authentication) {
        User current = userService.currentUser(authentication);
        return complaintRepository.findByCreatedBy(current, pageable)
                .map(complaint -> complaintMapper.toResponse(complaint, current));
    }
    // public Page<ComplaintResponse> myComplaints(Pageable pageable, Authentication
    // authentication) {
    // throw new RuntimeException("Test exception");
    // // User current = userService.currentUser(authentication);

    // // System.out.println("Before query");

    // // Page<Complaint> complaints = complaintRepository.findByCreatedBy(current,
    // // pageable);

    // // System.out.println("After query");

    // // return complaints.map(complaint -> complaintMapper.toResponse(complaint,
    // // current));
    // }

    public Page<ComplaintResponse> assignedComplaints(Pageable pageable, Authentication authentication) {
        User officer = userService.currentUser(authentication);
        return complaintRepository.findByAssignedOfficer(officer, pageable)
                .map(complaint -> complaintMapper.toResponse(complaint, officer));
    }

    public ComplaintResponse get(Long id, Authentication authentication) {
        User current = userService.currentUser(authentication);
        return complaintMapper.toResponse(findById(id), current);
    }

    @Transactional
    public ComplaintResponse create(ComplaintCreateRequest request, Authentication authentication) {
        User current = userService.currentUser(authentication);
        Complaint complaint = Complaint.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .status(ComplaintStatus.PENDING)
                .location(request.location())
                .imageUrl(request.imageUrl())
                .createdBy(current)
                .build();
        return complaintMapper.toResponse(complaintRepository.save(complaint), current);
    }

    @Transactional
    public ComplaintResponse updateOwn(Long id, ComplaintUpdateRequest request, Authentication authentication) {
        User current = userService.currentUser(authentication);
        Complaint complaint = findById(id);
        requireOwner(complaint, current);
        if (complaint.getStatus() == ComplaintStatus.RESOLVED || complaint.getStatus() == ComplaintStatus.REJECTED) {
            throw new BadRequestException("Closed complaints cannot be edited");
        }
        complaint.setTitle(request.title());
        complaint.setDescription(request.description());
        complaint.setCategory(request.category());
        complaint.setLocation(request.location());
        complaint.setImageUrl(request.imageUrl());
        return complaintMapper.toResponse(complaint, current);
    }

    @Transactional
    public void deleteOwn(Long id, Authentication authentication) {
        User current = userService.currentUser(authentication);
        Complaint complaint = findById(id);
        requireOwner(complaint, current);
        complaintRepository.delete(complaint);
    }

    @Transactional
    public void deleteByAdmin(Long id) {
        complaintRepository.delete(findById(id));
    }

    @Transactional
    public ComplaintResponse assignOfficer(Long id, Long officerId, Authentication authentication) {
        User admin = userService.currentUser(authentication);
        Complaint complaint = findById(id);
        User officer = userService.findById(officerId);
        if (officer.getRole() != Role.OFFICER) {
            throw new BadRequestException("Selected user is not an officer");
        }
        complaint.setAssignedOfficer(officer);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        return complaintMapper.toResponse(complaint, admin);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, ComplaintStatus status, Authentication authentication) {
        User officer = userService.currentUser(authentication);
        Complaint complaint = findById(id);
        requireAssignedOfficer(complaint, officer);
        complaint.setStatus(status);
        return complaintMapper.toResponse(complaint, officer);
    }

    @Transactional
    public RemarkResponse addRemark(Long id, String comment, Authentication authentication) {
        User officer = userService.currentUser(authentication);
        Complaint complaint = findById(id);
        requireAssignedOfficer(complaint, officer);
        Remark remark = Remark.builder().complaint(complaint).officer(officer).comment(comment).build();
        remarkRepository.save(remark);
        complaint.getRemarks().add(remark);
        return complaintMapper.toRemarkResponse(remark);
    }

    @Transactional
    public long support(Long id, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Complaint complaint = findById(id);
        if (!supportRepository.existsByComplaintAndUser(complaint, user)) {
            supportRepository.save(ComplaintSupport.builder().complaint(complaint).user(user).build());
        }
        return supportRepository.countByComplaint(complaint);
    }

    @Transactional
    public long removeSupport(Long id, Authentication authentication) {
        User user = userService.currentUser(authentication);
        Complaint complaint = findById(id);
        supportRepository.findByComplaintAndUser(complaint, user).ifPresent(supportRepository::delete);
        return supportRepository.countByComplaint(complaint);
    }

    public Complaint findById(Long id) {
        return complaintRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
    }

    private void requireOwner(Complaint complaint, User user) {
        if (!complaint.getCreatedBy().getId().equals(user.getId())) {
            throw new ForbiddenActionException("You can manage only your own complaints");
        }
    }

    private void requireAssignedOfficer(Complaint complaint, User officer) {
        if (officer.getRole() != Role.OFFICER || complaint.getAssignedOfficer() == null
                || !complaint.getAssignedOfficer().getId().equals(officer.getId())) {
            throw new ForbiddenActionException("Complaint is not assigned to this officer");
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
