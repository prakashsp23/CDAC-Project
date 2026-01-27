package com.backend.repository.Customer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.entity.Services;
import com.backend.entity.ServiceStatus;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {
    List<Services> findByUser_Id(Long userId);

    List<Services> findByStatusInAndUser_Id(List<ServiceStatus> status, Long userId);
}
