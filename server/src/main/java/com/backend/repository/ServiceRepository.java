package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.entity.Services;
import com.backend.entity.ServiceStatus;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {
    List<Services> findByUser_Id(Long userId);

    List<Services> findByStatusInAndUser_Id(List<ServiceStatus> status, Long userId);
    
    List<Services> findByStatusAndMechanic_Id(ServiceStatus status, Long mechanicId);

    List<Services> findByMechanic_IdAndStatus(Long mechanicId, ServiceStatus status);
}
