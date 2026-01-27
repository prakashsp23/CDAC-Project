package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.entity.Part;

@Repository
public interface PartRepository extends JpaRepository<Part, Long> {
}
