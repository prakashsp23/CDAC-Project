package com.backend.service.CustomerService;

import java.util.List;

import com.backend.dtos.FeedbackDTOs.FeedbackHistoryDto;
import com.backend.dtos.FeedbackDTOs.FeedbackReq;

public interface FeedbackService {

    public List<FeedbackHistoryDto> getMyFeedbacks(Long userId);

    public String submitFeedback(FeedbackReq feedbackReq, Long userId);

}
