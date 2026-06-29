package com.smartcity.complaints.controller;

import com.smartcity.complaints.dto.*;
import com.smartcity.complaints.entity.ComplaintCategory;
import com.smartcity.complaints.entity.ComplaintStatus;
import com.smartcity.complaints.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
public class ComplaintController {
    private final ComplaintService complaintService;

    @GetMapping
    public ApiResponse<Page<ComplaintResponse>> search(@RequestParam(required = false) ComplaintStatus status,
                                                       @RequestParam(required = false) ComplaintCategory category,
                                                       @RequestParam(required = false) String location,
                                                       @RequestParam(required = false) String q,
                                                       @PageableDefault(size = 10, sort = "createdAt") Pageable pageable,
                                                       Authentication authentication) {
        return ApiResponse.ok("Complaints fetched", complaintService.search(status, category, location, q, pageable, authentication));
    }

    @GetMapping("/{id}")
    public ApiResponse<ComplaintResponse> get(@PathVariable Long id, Authentication authentication) {
        return ApiResponse.ok("Complaint fetched", complaintService.get(id, authentication));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ApiResponse<ComplaintResponse> create(@Valid @RequestBody ComplaintCreateRequest request, Authentication authentication) {
        return ApiResponse.ok("Complaint created", complaintService.create(request, authentication));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/me")
    public ApiResponse<Page<ComplaintResponse>> myComplaints(@PageableDefault(size = 10, sort = "createdAt") Pageable pageable,
                                                             Authentication authentication) {
        return ApiResponse.ok("Own complaints fetched", complaintService.myComplaints(pageable, authentication));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ApiResponse<ComplaintResponse> updateOwn(@PathVariable Long id,
                                                    @Valid @RequestBody ComplaintUpdateRequest request,
                                                    Authentication authentication) {
        return ApiResponse.ok("Complaint updated", complaintService.updateOwn(id, request, authentication));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteOwn(@PathVariable Long id, Authentication authentication) {
        complaintService.deleteOwn(id, authentication);
        return ApiResponse.ok("Complaint deleted", null);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{id}/support")
    public ApiResponse<Map<String, Long>> support(@PathVariable Long id, Authentication authentication) {
        return ApiResponse.ok("Complaint supported", Map.of("supportCount", complaintService.support(id, authentication)));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}/support")
    public ApiResponse<Map<String, Long>> removeSupport(@PathVariable Long id, Authentication authentication) {
        return ApiResponse.ok("Complaint support removed", Map.of("supportCount", complaintService.removeSupport(id, authentication)));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @GetMapping("/assigned")
    public ApiResponse<Page<ComplaintResponse>> assigned(@PageableDefault(size = 10, sort = "createdAt") Pageable pageable,
                                                         Authentication authentication) {
        return ApiResponse.ok("Assigned complaints fetched", complaintService.assignedComplaints(pageable, authentication));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PatchMapping("/{id}/status")
    public ApiResponse<ComplaintResponse> updateStatus(@PathVariable Long id,
                                                       @Valid @RequestBody StatusUpdateRequest request,
                                                       Authentication authentication) {
        return ApiResponse.ok("Status updated", complaintService.updateStatus(id, request.status(), authentication));
    }

    @PreAuthorize("hasRole('OFFICER')")
    @PostMapping("/{id}/remarks")
    public ApiResponse<RemarkResponse> addRemark(@PathVariable Long id,
                                                 @Valid @RequestBody RemarkRequest request,
                                                 Authentication authentication) {
        return ApiResponse.ok("Remark added", complaintService.addRemark(id, request.comment(), authentication));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/assign")
    public ApiResponse<ComplaintResponse> assign(@PathVariable Long id,
                                                 @Valid @RequestBody AssignOfficerRequest request,
                                                 Authentication authentication) {
        return ApiResponse.ok("Officer assigned", complaintService.assignOfficer(id, request.officerId(), authentication));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ApiResponse<Void> deleteByAdmin(@PathVariable Long id) {
        complaintService.deleteByAdmin(id);
        return ApiResponse.ok("Complaint deleted by admin", null);
    }
}
