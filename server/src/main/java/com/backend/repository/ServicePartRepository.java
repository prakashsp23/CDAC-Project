package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entity.ServicePart;

@Repository
public interface ServicePartRepository extends JpaRepository<ServicePart, Long> {

    boolean existsByPart_Id(Long partId);
}
