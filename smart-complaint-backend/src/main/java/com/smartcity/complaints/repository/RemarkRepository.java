package com.smartcity.complaints.repository;

import com.smartcity.complaints.entity.Complaint;
import com.smartcity.complaints.entity.Remark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RemarkRepository extends JpaRepository<Remark, Long> {
    List<Remark> findByComplaintOrderByCreatedAtDesc(Complaint complaint);
}
