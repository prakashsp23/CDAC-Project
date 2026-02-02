package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entity.MechanicNote;

@Repository
public interface MechanicNoteRepository extends JpaRepository<MechanicNote, Long> {

    List<MechanicNote> findByService_Id(Long serviceId);
}
