package com.backend.controller;

import com.backend.dtos.CustomerDTOs.CompletedServiceDto;
import com.backend.dtos.CustomerDTOs.FeedbackHistoryDto;
import com.backend.dtos.CustomerDTOs.FeedbackReq;
import com.backend.dtos.CustomerDTOs.OngoingServiceDto;
import com.backend.entity.ServiceCatalog;
import com.backend.entity.Services;
import com.backend.service.CustomerService.CustomerService;
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
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // Include all services history of a user
    @GetMapping("/myServices")
    public ResponseEntity<?> getMyServices() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<Services> services = customerService.getMyServices(userId);
        return ResponseBuilder.success("Services retrieved successfully", services);
    }

    @GetMapping("/getOngoingService")
    public ResponseEntity<?> getOngoingService() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<OngoingServiceDto> ongoingServices = customerService.getOngoingService(userId);
        return ResponseBuilder.success("Ongoing services retrieved successfully", ongoingServices);
    }

    // Incomplete
    @GetMapping("/allServices")
    public ResponseEntity<?> getAllServices() {
        List<ServiceCatalog> services = customerService.getAllServices();
        return ResponseBuilder.success("All services retrieved successfully", services);
    }

    @GetMapping("/myFeedbacks")
    public ResponseEntity<?> getMyFeedbacks() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<FeedbackHistoryDto> feedbacks = customerService.getMyFeedbacks(userId);
        return ResponseBuilder.success("Feedbacks retrieved successfully", feedbacks);
    }

    @GetMapping("/completedServicesForFeedback")
    public ResponseEntity<?> getCompletedServicesForFeedback() {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        List<CompletedServiceDto> completedServices = customerService.getCompletedServices(userId);
        return ResponseBuilder.success("Completed services retrieved successfully", completedServices);
    }

    @PostMapping("/submitFeedback")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackReq feedbackReq) {
        Long userId = AuthUtil.getAuthenticatedUserId();
        if (userId == null) {
            return AuthUtil.unauthorizedResponse();
        }
        String message = customerService.submitFeedback(feedbackReq, userId);
        return ResponseBuilder.success(message, null);
    }
}
