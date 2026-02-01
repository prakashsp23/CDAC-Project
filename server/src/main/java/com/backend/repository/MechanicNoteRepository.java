package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entity.MechanicNote;

@Repository
public interface MechanicNoteRepository extends JpaRepository<MechanicNote, Long> {

    java.util.List<MechanicNote> findByService_Id(Long serviceId);
}
