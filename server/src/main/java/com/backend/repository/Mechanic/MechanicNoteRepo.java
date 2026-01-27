package com.backend.repository.Mechanic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.entity.MechanicNote;

@Repository
public interface MechanicNoteRepo extends JpaRepository<MechanicNote, Long> {

}
