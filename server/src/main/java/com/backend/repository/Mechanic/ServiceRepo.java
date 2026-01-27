package com.backend.repository.Mechanic;

import java.io.ObjectInputFilter.Status;
import java.security.Provider.Service;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.entity.Services;
import com.backend.entity.ServiceStatus;

@Repository
public interface ServiceRepo extends JpaRepository<Services, Long> {
    List<Services> findByStatusAndMechanic_UserId(ServiceStatus status, Long mechanicId);
    
    List<Services> findByMechanic_UserIdAndStatus(Long mechanicId, ServiceStatus status);
        
}

