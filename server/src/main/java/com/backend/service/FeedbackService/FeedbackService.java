package com.backend.service.FeedbackService;

import java.util.List;

import com.backend.dtos.FeedbackDTOs.AdminFeedbackDTO;
import com.backend.dtos.FeedbackDTOs.FeedbackHistoryDto;
import com.backend.dtos.FeedbackDTOs.FeedbackReq;

public interface FeedbackService {
	
	List<AdminFeedbackDTO> getAllFeedback();

    public List<FeedbackHistoryDto> getMyFeedbacks(Long userId);

    public String submitFeedback(FeedbackReq feedbackReq, Long userId);

}
