package com.backend.repository.Customer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByUser_Id(Long userId);
}
