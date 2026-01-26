package com.backend.repository.Mechanic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entity.ServicePart;

@Repository
public interface ServicePartRepo extends JpaRepository<ServicePart, Long> {
    
}
