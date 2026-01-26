package com.backend.repository.Admin;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Services;

public interface AdminServicesRepository extends JpaRepository<Services, Long> {
}
