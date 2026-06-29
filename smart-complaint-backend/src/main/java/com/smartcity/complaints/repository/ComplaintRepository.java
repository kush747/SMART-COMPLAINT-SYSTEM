package com.smartcity.complaints.repository;

import com.smartcity.complaints.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Page<Complaint> findByCreatedBy(User user, Pageable pageable);
    Page<Complaint> findByAssignedOfficer(User officer, Pageable pageable);
    long countByCreatedBy(User user);
    long countByCreatedByAndStatus(User user, ComplaintStatus status);
    long countByAssignedOfficer(User officer);
    long countByAssignedOfficerAndStatus(User officer, ComplaintStatus status);
    long countByStatus(ComplaintStatus status);
    long countByCategory(ComplaintCategory category);

    @Query("""
            select c from Complaint c
            where (:status is null or c.status = :status)
              and (:category is null or c.category = :category)
              and (:location is null or lower(c.location) like lower(concat('%', :location, '%')))
              and (:search is null or lower(c.title) like lower(concat('%', :search, '%'))
                   or lower(c.description) like lower(concat('%', :search, '%')))
            """)
    Page<Complaint> search(@Param("status") ComplaintStatus status,
                           @Param("category") ComplaintCategory category,
                           @Param("location") String location,
                           @Param("search") String search,
                           Pageable pageable);

    @Query("""
            select year(c.createdAt), month(c.createdAt), count(c)
            from Complaint c
            where c.createdAt >= :from
            group by year(c.createdAt), month(c.createdAt)
            order by year(c.createdAt), month(c.createdAt)
            """)
    List<Object[]> monthlyStats(@Param("from") Instant from);
}
