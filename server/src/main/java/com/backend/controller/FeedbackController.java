package com.backend.controller;

import com.backend.aop.annotation.Admin;
import com.backend.aop.annotation.Customer;
import com.backend.dtos.FeedbackDTOs.FeedbackHistoryDto;
import com.backend.dtos.FeedbackDTOs.FeedbackReq;
import com.backend.service.FeedbackService.FeedbackService;
import com.backend.util.AuthUtil;
import com.backend.util.ResponseBuilder;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Customer
    @GetMapping("/me")
    public ResponseEntity<?> getMyFeedbacks() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<FeedbackHistoryDto> feedbacks = feedbackService.getMyFeedbacks(userId);
        return ResponseBuilder.success("Feedbacks retrieved successfully", feedbacks);
    }

    @Customer
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackReq feedbackReq) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        String message = feedbackService.submitFeedback(feedbackReq, userId);
        return ResponseBuilder.success(message, null);
    }

    @Admin
    @GetMapping("/all")
    public ResponseEntity<?> getAllFeedback() {
        return ResponseBuilder.success("All feedback retrieved successfully", feedbackService.getAllFeedback());
    }
}
