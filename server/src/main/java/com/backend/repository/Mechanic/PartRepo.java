package com.backend.repository.Mechanic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.entity.Part;

@Repository
public interface PartRepo extends JpaRepository<Part, Long> {
}
