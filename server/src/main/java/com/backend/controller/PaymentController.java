package com.backend.controller;

import com.backend.aop.annotation.Customer;
import com.backend.dtos.PaymentDTOs.PaymentRequest;
import com.backend.dtos.PaymentDTOs.PaymentResponse;
import com.backend.service.PaymentService.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.util.ResponseBuilder;
import com.backend.dtos.ApiResponse;
import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Adjust as needed
public class PaymentController {

    private final PaymentService paymentService;

    @Customer
    @PostMapping("/create-payment-intent")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPaymentIntent(
            @RequestBody PaymentRequest paymentRequest) throws StripeException {
        PaymentResponse response = paymentService.createPaymentIntent(paymentRequest);
        return ResponseBuilder.success("Payment intent created successfully", response);
    }

    @Customer
    @PostMapping("/confirm-payment")
    public ResponseEntity<ApiResponse<Object>> confirmPayment(@RequestBody Map<String, String> payload)
            throws StripeException {
        String paymentIntentId = payload.get("paymentIntentId");
        paymentService.updatePaymentStatus(paymentIntentId);
        return ResponseBuilder.success("Payment status updated", null);
    }
}
