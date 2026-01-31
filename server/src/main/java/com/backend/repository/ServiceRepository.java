package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.backend.entity.Services;
import com.backend.entity.ServiceStatus;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {
  List<Services> findByUser_Id(Long userId);

  List<Services> findByStatusInAndUser_Id(List<ServiceStatus> status, Long userId);

  List<Services> findByStatusAndMechanic_Id(ServiceStatus status, Long mechanicId);

  List<Services> findByMechanic_IdAndStatus(Long mechanicId, ServiceStatus status);

  long countByMechanic_Id(Long mechanicId);

  Long countByStatus(ServiceStatus status);

  @Query("""
          SELECT s
          FROM Services s
          WHERE s.mechanic IS NULL
            AND s.status = 'PENDING'
          ORDER BY s.createdOn DESC
      """)
  List<Services> findUnassignedServices();

  @Query("""
          SELECT s
          FROM Services s
          WHERE s.status = :status
            AND s.user.id = :id
            AND NOT EXISTS (SELECT f FROM Feedback f WHERE f.service = s)
      """)
  List<Services> findServiceWithoutFeedback(@Param("id") Long id, @Param("status") ServiceStatus status);
}
