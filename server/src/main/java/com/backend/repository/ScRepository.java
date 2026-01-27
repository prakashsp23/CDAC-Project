package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entity.ServiceCatalog;

@Repository
public interface ScRepository extends JpaRepository<ServiceCatalog, Long> {

}
