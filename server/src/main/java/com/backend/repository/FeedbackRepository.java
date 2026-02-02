package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByUser_Id(Long userId);

    Feedback findByService(com.backend.entity.Services service);

    boolean existsByService(com.backend.entity.Services service);
}
