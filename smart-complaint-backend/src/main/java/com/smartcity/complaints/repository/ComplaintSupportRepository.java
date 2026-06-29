package com.smartcity.complaints.repository;

import com.smartcity.complaints.entity.Complaint;
import com.smartcity.complaints.entity.ComplaintSupport;
import com.smartcity.complaints.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComplaintSupportRepository extends JpaRepository<ComplaintSupport, Long> {
    boolean existsByComplaintAndUser(Complaint complaint, User user);
    long countByComplaint(Complaint complaint);
    Optional<ComplaintSupport> findByComplaintAndUser(Complaint complaint, User user);
}
