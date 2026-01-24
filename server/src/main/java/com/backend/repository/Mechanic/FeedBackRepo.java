package com.backend.repository.Mechanic;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entity.Feedback;

public interface FeedBackRepo extends JpaRepository<Feedback, Long> {
    Feedback findByService(com.backend.entity.Services service);
    
}
